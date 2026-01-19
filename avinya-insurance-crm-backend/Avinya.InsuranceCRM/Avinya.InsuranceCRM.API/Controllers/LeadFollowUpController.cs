using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.Application.ResponseModels;
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

    //[HttpPost]
    //public async Task<IActionResult> Create(
    //CreateLeadFollowUpRequest request)
    //{
    //    var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

    //    if (string.IsNullOrEmpty(advisorId))
    //        return Unauthorized("Advisor not found in token");

    //    var lead = await _leadRepo.GetByIdAsync(advisorId, request.LeadId);

    //    if (lead == null)
    //        return NotFound("Lead not found");

    //    if (lead.LeadStatusId == 5 || lead.LeadStatusId == 6)
    //        return BadRequest("Follow-up not allowed for Converted or Lost leads");

    //    using var transaction = await _followUpRepo.BeginTransactionAsync();

    //    try
    //    {
    //        var followUp = new LeadFollowUp
    //        {
    //            FollowUpId = Guid.NewGuid(),
    //            LeadId = request.LeadId,
    //            FollowUpDate = request.FollowUpDate,
    //            NextFollowUpDate = request.NextFollowUpDate,
    //            Remark = request.Remark,
    //            CreatedBy = Guid.Parse(advisorId),
    //            CreatedAt = DateTime.UtcNow
    //        };

    //        await _followUpRepo.AddAsync(followUp);

    //        if (lead.LeadStatusId != 4) 
    //        {
    //            lead.LeadStatusId = 4; 
    //            lead.UpdatedAt = DateTime.UtcNow;

    //            await _leadRepo.UpdateAsync(lead);
    //        }

    //        await transaction.CommitAsync();

    //        return Ok(new
    //        {
    //            Message = "Follow-up created successfully",
    //            FollowUpId = followUp.FollowUpId
    //        });
    //    }
    //    catch
    //    {
    //        await transaction.RollbackAsync();
    //        throw;
    //    }
    //}
}
