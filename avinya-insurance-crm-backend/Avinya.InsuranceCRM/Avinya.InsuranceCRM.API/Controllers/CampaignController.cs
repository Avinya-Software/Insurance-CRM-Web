using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/campaigns")]
[Authorize(Roles = "Advisor,CompanyAdmin")]
public class CampaignController : ControllerBase
{
    private readonly ICampaignRepository _repository;

    public CampaignController(ICampaignRepository repository)
    {
        _repository = repository;
    }

    /* ================= CREATE ================= */

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CampaignCreateRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var companyId = Guid.Parse(User.FindFirst("CompanyId")!.Value);

        var campaign = await _repository.CreateCampaignAsync(
            companyId,
            userId,
            role,
            request.Campaign,
            request.Templates,
            request.Rules,
            request.CustomerIds);

        return CreatedAtAction(
            nameof(GetById),
            new { campaignId = campaign.CampaignId },
            campaign);
    }

    /* ================= GET BY ID ================= */

    [HttpGet("{campaignId}")]
    public async Task<IActionResult> GetById(Guid campaignId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var companyId = Guid.Parse(User.FindFirst("CompanyId")!.Value);

        var campaign = await _repository.GetByIdAsync(
            campaignId,
            companyId,
            userId,
            role);

        if (campaign == null)
            return NotFound();

        return Ok(campaign);
    }

    /* ================= GET PAGED ================= */

    [HttpGet]
    public async Task<IActionResult> GetPaged(
        int pageNumber = 1,
        int pageSize = 10,
        string? search = null)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var companyId = Guid.Parse(User.FindFirst("CompanyId")!.Value);

        var result = await _repository.GetPagedAsync(
            companyId,
            userId,
            role,
            pageNumber,
            pageSize,
            search);

        return Ok(new
        {
            items = result.Items,
            totalCount = result.TotalCount
        });
    }

    /* ================= UPDATE ================= */

    [HttpPut("{campaignId}")]
    public async Task<IActionResult> Update(
        Guid campaignId,
        [FromBody] CampaignCreateRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var companyId = Guid.Parse(User.FindFirst("CompanyId")!.Value);

        await _repository.UpdateCampaignAsync(
            campaignId,
            companyId,
            userId,
            role,
            request.Campaign,
            request.Templates,
            request.Rules,
            request.CustomerIds);

        return NoContent();
    }

    /* ================= DELETE ================= */

    [HttpDelete("{campaignId}")]
    public async Task<IActionResult> Delete(Guid campaignId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var companyId = Guid.Parse(User.FindFirst("CompanyId")!.Value);

        await _repository.DeleteCampaignAsync(
            campaignId,
            companyId,
            userId,
            role);

        return NoContent();
    }

    /* ================= DROPDOWN ================= */

    [HttpGet("dropdown")]
    public async Task<IActionResult> Dropdown()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var companyId = Guid.Parse(User.FindFirst("CompanyId")!.Value);

        var data = await _repository.GetDropdownAsync(
            companyId,
            userId,
            role);

        return Ok(data.Select(x => new
        {
            campaignId = x.CampaignId,
            name = x.Name
        }));
    }

    /* ================= CAMPAIGN TYPES ================= */

    [HttpGet("campaign-types/dropdown")]
    public async Task<IActionResult> CampaignTypeDropdown()
    {
        var data = await _repository.GetCampaignTypeDropdownAsync();

        return Ok(data.Select(x => new
        {
            campaignTypeId = x.CampaignTypeId,
            name = x.Name
        }));
    }
}
