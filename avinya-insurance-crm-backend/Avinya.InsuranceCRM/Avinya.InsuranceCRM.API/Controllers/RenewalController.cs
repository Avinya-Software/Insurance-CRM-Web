using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/renewals")]
[Authorize(Roles = "Advisor")]
public class RenewalController : ControllerBase
{
    private readonly IRenewalRepository _renewalRepository;

    public RenewalController(IRenewalRepository renewalRepository)
    {
        _renewalRepository = renewalRepository;
    }

    // ---------------- UPSERT ----------------
    [HttpPost("upsert")]
    public async Task<IActionResult> Upsert([FromBody] Renewal renewal)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        renewal.CreatedBy = userId;
        renewal.CreatedAt = DateTime.UtcNow;
        var result = await _renewalRepository.UpsertAsync(renewal, userId);
        return Ok(result);
    }

    // ---------------- LIST ----------------
    [HttpGet]
    public async Task<IActionResult> GetRenewals(
        int pageNumber = 1,
        int pageSize = 10,
        string? search = null,
        int? renewalStatusId = null)
    {
        var result = await _renewalRepository.GetRenewalsAsync(
            pageNumber,
            pageSize,
            search,
            renewalStatusId
        );

        return Ok(result);
    }

    // ---------------- STATUS DROPDOWN ----------------
    [HttpGet("statuses")]
    public async Task<IActionResult> GetStatuses()
    {
        var result = await _renewalRepository.GetRenewalStatusesAsync();
        return Ok(result);
    }
}
