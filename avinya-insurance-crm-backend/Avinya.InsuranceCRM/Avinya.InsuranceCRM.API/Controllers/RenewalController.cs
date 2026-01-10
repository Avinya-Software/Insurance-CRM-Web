using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/renewals")]
    [Authorize(Policy = "ApprovedAdvisor")]
    public class RenewalController : ControllerBase
    {
        private readonly IRenewalRepository _renewalRepository;

        public RenewalController(IRenewalRepository renewalRepository)
        {
            _renewalRepository = renewalRepository;
        }

        /* ================= UPSERT ================= */

        [HttpPost("upsert")]
        public async Task<IActionResult> Upsert(
            [FromBody] Renewal renewal)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token");

            var result = await _renewalRepository.UpsertAsync(
                renewal,
                advisorId
            );

            return Ok(new
            {
                result.RenewalId,
                Message = renewal.RenewalId == Guid.Empty
                    ? "Renewal created successfully"
                    : "Renewal updated successfully"
            });
        }

        /* ================= LIST ================= */

        [HttpGet]
        public async Task<IActionResult> GetRenewals(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null,
            int? renewalStatusId = null)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token");

            var result = await _renewalRepository.GetRenewalsAsync(
                advisorId,
                pageNumber,
                pageSize,
                search,
                renewalStatusId
            );

            return Ok(result);
        }

        /* ================= GET BY ID ================= */

        [HttpGet("{renewalId:guid}")]
        public async Task<IActionResult> GetById(Guid renewalId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token");

            var renewal = await _renewalRepository.GetByIdAsync(
                renewalId,
                advisorId
            );

            if (renewal == null)
                return NotFound("Renewal not found");

            return Ok(renewal);
        }

        /* ================= DELETE ================= */

        [HttpDelete("{renewalId:guid}")]
        public async Task<IActionResult> Delete(Guid renewalId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token");

            await _renewalRepository.DeleteByIdAsync(
                renewalId,
                advisorId
            );

            return Ok("Renewal deleted successfully");
        }

        /* ================= STATUS DROPDOWN ================= */

        [HttpGet("statuses")]
        public async Task<IActionResult> GetStatuses()
        {
            var statuses = await _renewalRepository.GetRenewalStatusesAsync();

            return Ok(statuses.Select(x => new
            {
                id = x.RenewalStatusId,
                name = x.StatusName
            }));
        }
    }
}
