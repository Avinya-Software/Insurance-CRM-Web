using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/campaigns")]
[Authorize(Policy = "ApprovedAdvisor")]
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
        var campaign = await _repository.CreateCampaignAsync(
            request.Campaign,
            request.Templates,
            request.Rules,
            request.CustomerIds);

        return CreatedAtAction(
            nameof(GetById),
            new { campaignId = campaign.CampaignId },
            campaign);
    }

    /* ================= GET ================= */

    [HttpGet("{campaignId}")]
    public async Task<IActionResult> GetById(Guid campaignId)
    {
        var campaign = await _repository.GetByIdAsync(campaignId);

        if (campaign == null)
            return NotFound();

        return Ok(campaign);
    }
    [HttpGet]
    public async Task<IActionResult> GetPaged(
    int pageNumber = 1,
    int pageSize = 10,
    string? search = null)
    {
        var result = await _repository.GetPagedAsync(
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
        await _repository.UpdateCampaignAsync(
            campaignId,
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
        await _repository.DeleteCampaignAsync(campaignId);
        return NoContent();
    }

    /* ================= DROPDOWN ================= */

    [HttpGet("dropdown")]
    public async Task<IActionResult> Dropdown()
    {
        var data = await _repository.GetDropdownAsync();

        return Ok(data.Select(x => new
        {
            campaignId = x.CampaignId,
            name = x.Name
        }));
    }
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
