using Avinya.InsuranceCRM.API.RequestModels;
using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/lead-followups")]
[Authorize(Policy = "ApprovedAdvisor")]
public class LeadFollowUpController : ControllerBase
{
    private readonly ILeadRepository _leadRepo;
    private readonly ILeadFollowUpRepository _followUpRepo;

    public LeadFollowUpController(
        ILeadRepository leadRepo,
        ILeadFollowUpRepository followUpRepo)
    {
        _leadRepo = leadRepo;
        _followUpRepo = followUpRepo;
    }

    // ---------- CREATE FOLLOW-UP ----------
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateLeadFollowUpRequest request)
    {
        // 1️⃣ Validate Lead
        var lead = await _leadRepo.GetByIdAsync(request.LeadId);
        if (lead == null)
            return NotFound("Lead not found");

        // ❌ Optional business rule
        if (lead.LeadStatusId == 5 || lead.LeadStatusId == 6)
            return BadRequest("Follow-up not allowed for Converted/Lost leads");

        // 2️⃣ Create Follow-Up
        var followUp = new LeadFollowUp
        {
            FollowUpId = Guid.NewGuid(),
            LeadId = request.LeadId,
            FollowUpDate = request.FollowUpDate,
            NextFollowUpDate = request.NextFollowUpDate,
            Remark = request.Remark,
            CreatedBy = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            ),
            CreatedAt = DateTime.UtcNow
        };

        await _followUpRepo.AddAsync(followUp);

        // 3️⃣ Update Lead Status → Follow Up (4)
        lead.LeadStatusId = 4;
        lead.UpdatedAt = DateTime.UtcNow;

        await _leadRepo.UpdateAsync(lead);

        return Ok(new
        {
            Message = "Follow-up created successfully",
            FollowUpId = followUp.FollowUpId
        });
    }
    [HttpGet("by-lead/{leadId}")]
    public async Task<IActionResult> GetByLeadId(Guid leadId)
    {
        // 1️⃣ Validate Lead
        var lead = await _leadRepo.GetByIdAsync(leadId);
        if (lead == null)
            return NotFound("Lead not found");

        // 2️⃣ Fetch Follow-Ups
        var followUps = await _followUpRepo.GetByLeadIdAsync(leadId);

        // 3️⃣ Map to Response
        var response = followUps.Select(x => new LeadFollowUpResponse
        {
            FollowUpId = x.FollowUpId,
            FollowUpDate = x.FollowUpDate,
            NextFollowUpDate = x.NextFollowUpDate,
            Remark = x.Remark,
            CreatedAt = x.CreatedAt,
            CreatedBy = x.CreatedBy
        }).ToList();

        return Ok(response);
    }
}
