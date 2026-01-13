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

    /*   CREATE FOLLOW-UP   */

    [HttpPost]
    public async Task<IActionResult> Create(
    CreateLeadFollowUpRequest request)
    {
        var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(advisorId))
            return Unauthorized("Advisor not found in token");

        /* 1️⃣ Validate Lead (Advisor scoped) */
        var lead = await _leadRepo.GetByIdAsync(advisorId, request.LeadId);

        if (lead == null)
            return NotFound("Lead not found");

        /* ❌ Business rule */
        if (lead.LeadStatusId == 5 || lead.LeadStatusId == 6)
            return BadRequest("Follow-up not allowed for Converted or Lost leads");

        /* 2️⃣ Transaction (important) */
        using var transaction = await _followUpRepo.BeginTransactionAsync();

        try
        {
            /* 3️⃣ Create Follow-Up */
            var followUp = new LeadFollowUp
            {
                FollowUpId = Guid.NewGuid(),
                LeadId = request.LeadId,
                FollowUpDate = request.FollowUpDate,
                NextFollowUpDate = request.NextFollowUpDate,
                Remark = request.Remark,
                CreatedBy = Guid.Parse(advisorId),
                CreatedAt = DateTime.UtcNow
            };

            await _followUpRepo.AddAsync(followUp);

            /* 4️⃣ Update Lead Status → Follow Up */
            if (lead.LeadStatusId != 4) // avoid unnecessary update
            {
                lead.LeadStatusId = 4; // Follow Up
                lead.UpdatedAt = DateTime.UtcNow;

                await _leadRepo.UpdateAsync(lead);
            }

            await transaction.CommitAsync();

            return Ok(new
            {
                Message = "Follow-up created successfully",
                FollowUpId = followUp.FollowUpId
            });
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
    /*   GET FOLLOW-UPS BY LEAD   */

    [HttpGet("by-lead/{leadId:guid}")]
    public async Task<IActionResult> GetByLeadId(Guid leadId)
    {
        var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(advisorId))
            return Unauthorized("Advisor not found in token");

        /* 1️⃣ Validate Lead (Advisor-scoped) */
        var lead = await _leadRepo.GetByIdAsync(
            advisorId,
            leadId
        );

        if (lead == null)
            return NotFound("Lead not found");

        /* 2️⃣ Fetch Follow-Ups */
        var followUps = await _followUpRepo.GetByLeadIdAsync(leadId);

        /* 3️⃣ Map Response */
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
