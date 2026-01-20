using Avinya.InsuranceCRM.Application.Interfaces.LeadFollowUp;
using Avinya.InsuranceCRM.Application.RequestModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/lead-followups")]
[Authorize(Policy = "ApprovedAdvisorOrCompanyAdmin")]
public class LeadFollowUpController : ControllerBase
{
    private readonly ILeadFollowUpServices _service;

    public LeadFollowUpController(ILeadFollowUpServices service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateLeadFollowUpRequest request)
    {
        var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var response = await _service.CreateOrUpdateAsync(advisorId, request);

        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("lead/{leadId}")]
    public async Task<IActionResult> GetLeadFollowupHistory(Guid leadId)
    {
        var result = await _service.GetFollowupHistoryAsync(leadId);

        if (result.StatusCode == 404)
            return NotFound(result);

        return Ok(result);
    }
}
