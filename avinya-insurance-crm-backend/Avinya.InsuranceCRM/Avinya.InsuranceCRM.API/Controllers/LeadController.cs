using Avinya.InsuranceCRM.Application.Interfaces.Lead;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.Design;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ApprovedAdvisorOrCompanyAdmin")]
public class LeadController : ControllerBase
{
    private readonly ILeadService _service;

    public LeadController(ILeadService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrUpdate(CreateOrUpdateLeadRequest request)
    {
        var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var companyIdClaim = User.FindFirstValue("CompanyId");
        Guid? companyId = null;
        if (Guid.TryParse(companyIdClaim, out var parsedCompanyId))
            companyId = parsedCompanyId;

        var response = await _service.CreateOrUpdateAsync(advisorId, companyId, request);
        return StatusCode(response.StatusCode, response);
    }

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
        var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);
        var companyIdClaim = User.FindFirstValue("CompanyId");

        Guid? companyId = Guid.TryParse(companyIdClaim, out var cid)
                ? cid
                : null;

        var response = await _service.GetPagedAsync(
            advisorId,
            role,
            companyId,
            pageNumber,
            pageSize,
            search,
            fullName,
            email,
            mobile,
            leadStatusId,
            leadSourceId);

        return StatusCode(response.StatusCode, response);
    }

    [HttpDelete("{leadId:guid}")]
    public async Task<IActionResult> Delete(Guid leadId)
    {
        var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var response = await _service.DeleteAsync(advisorId, leadId);
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("lead-statuses")]
    public async Task<IActionResult> GetStatuses()
        => StatusCode(200, await _service.GetLeadStatusesAsync());

    [HttpGet("lead-sources")]
    public async Task<IActionResult> GetSources()
        => StatusCode(200, await _service.GetLeadSourcesAsync());

    [HttpPatch("{leadId:guid}/status/{statusId:int}")]
    public async Task<IActionResult> UpdateStatus(
        Guid leadId,
        int statusId,
        [FromQuery] string? notes)
    {
        var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var response = await _service.UpdateStatusAsync(advisorId, leadId, statusId, notes);
        return StatusCode(response.StatusCode, response);
    }
}