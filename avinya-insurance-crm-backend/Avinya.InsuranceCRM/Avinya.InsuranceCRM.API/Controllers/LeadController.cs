using Avinya.InsuranceCRM.API.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ApprovedAdvisor")]
public class LeadController : ControllerBase
{
    private readonly ILeadRepository _repo;
    private readonly ICustomerRepository _customerRepo;

    public LeadController(
        ILeadRepository repo,
        ICustomerRepository customerRepo)
    {
        _repo = repo;
        _customerRepo = customerRepo;
    }

    // ---------- ADD / UPDATE LEAD ----------
    [HttpPost]
    public async Task<IActionResult> CreateOrUpdate(
        CreateOrUpdateLeadRequest request)
    {
        // 🔐 AdvisorId MUST come from JWT
        var advisorIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(advisorIdClaim))
            return Unauthorized("Advisor not found in token");

        var advisorId = advisorIdClaim;

        // ---------------- UPDATE ----------------
        if (request.LeadId.HasValue)
        {
            var lead = await _repo.GetByIdAsync(request.LeadId.Value);

            if (lead == null)
                return NotFound("Lead not found");

            lead.FullName = request.FullName;
            lead.Email = request.Email;
            lead.Mobile = request.Mobile;
            lead.LeadStatusId = request.LeadStatusId;
            lead.LeadSourceId = request.LeadSourceId;
            lead.LeadSourceDescription = request.LeadSourceDescription;
            lead.Notes = request.Notes;
            lead.Address = request.Address;
            lead.AdvisorId = advisorId;     // ✅ enforce ownership
            lead.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(lead);

            return Ok("Lead updated successfully");
        }

        // ---------------- CREATE ----------------
        Guid? customerId = request.CustomerId;

        // If customer does not exist → create customer
        if (!customerId.HasValue)
        {
            if (string.IsNullOrWhiteSpace(request.FullName) ||
                string.IsNullOrWhiteSpace(request.Mobile))
            {
                return BadRequest(
                    "FullName and Mobile are required to create customer");
            }

            var customer = new Customer
            {
                CustomerId = Guid.NewGuid(),
                FullName = request.FullName,
                PrimaryMobile = request.Mobile,
                Email = request.Email,
                Address = request.Address,
                AdvisorId = advisorId,      // ✅ JWT
                CreatedAt = DateTime.UtcNow
            };

            await _customerRepo.AddAsync(customer);
            customerId = customer.CustomerId;
        }

        var newLead = new Lead
        {
            LeadId = Guid.NewGuid(),
            LeadNo = await _repo.GenerateLeadNoAsync(),
            CustomerId = customerId,
            FullName = request.FullName,
            Email = request.Email,
            Mobile = request.Mobile,
            LeadStatusId = request.LeadStatusId,
            LeadSourceId = request.LeadSourceId,
            LeadSourceDescription = request.LeadSourceDescription,
            AdvisorId = advisorId,        // ✅ JWT
            Address = request.Address,
            CreatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(newLead);

        return Ok(new
        {
            newLead.LeadId,
            newLead.LeadNo,
            Message = "Lead created successfully"
        });
    }

    // ---------- SEARCH + PAGINATION ----------
    [HttpGet]
    public async Task<IActionResult> GetPaged(
        int pageNumber = 1,
        int pageSize = 10,
        string? search = null,
        string? fullName = null,
        string? email = null,
        string? mobile = null,
        int? leadStatusId = null,
        int? leadSourceId = null)
    {
        var result = await _repo.GetPagedAsync(
            pageNumber,
            pageSize,
            search,
            fullName,
            email,
            mobile,
            leadStatusId,
            leadSourceId
        );

        return Ok(new
        {
            result.TotalRecords,
            result.PageNumber,
            result.PageSize,
            TotalPages = (int)Math.Ceiling(
                result.TotalRecords / (double)result.PageSize
            ),
            Data = result.Data.Select(x => new
            {
                x.LeadId,
                x.LeadNo,
                x.FullName,
                x.Email,
                x.Mobile,
                x.CustomerId,
                LeadStatus = x.LeadStatus.StatusName,
                LeadSource = x.LeadSource.SourceName,
                x.CreatedAt,
                x.Address,
                x.Notes
            })
        });
    }

    // ---------- DELETE LEAD ----------
    [HttpDelete("{leadId:guid}")]
    public async Task<IActionResult> Delete(Guid leadId)
    {
        var deleted = await _repo.DeleteAsync(leadId);

        if (!deleted)
            return NotFound("Lead not found or cannot be deleted");

        return Ok("Lead deleted successfully");
    }

    // ---------- LEAD STATUS DROPDOWN ----------
    [HttpGet("lead-statuses")]
    public async Task<IActionResult> GetLeadStatuses()
    {
        var statuses = await _repo.GetLeadStatusesAsync();

        return Ok(statuses.Select(x => new
        {
            Id = x.LeadStatusId,
            Name = x.StatusName
        }));
    }

    // ---------- LEAD SOURCE DROPDOWN ----------
    [HttpGet("lead-sources")]
    public async Task<IActionResult> GetLeadSources()
    {
        var sources = await _repo.GetLeadSourcesAsync();

        return Ok(sources.Select(x => new
        {
            Id = x.LeadSourceId,
            Name = x.SourceName
        }));
    }
}
