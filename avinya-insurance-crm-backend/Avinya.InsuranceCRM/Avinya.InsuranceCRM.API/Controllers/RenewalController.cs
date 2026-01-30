using System.Security.Claims;
using Avinya.InsuranceCRM.Application.DTOs.Renewal;
using Avinya.InsuranceCRM.Application.Interfaces.Renewal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/renewals")]
    [Authorize(Policy = "ApprovedAdvisorOrCompanyAdmin")]
    public class RenewalController : ControllerBase
    {
        private readonly IRenewalService _service;

        public RenewalController(IRenewalService service)
        {
            _service = service;
        }

        [HttpPost("upsert")]
        public async Task<IActionResult> Upsert([FromBody] UpsertRenewalDto dto)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var companyIdClaim = User.FindFirstValue("CompanyId");
            Guid? companyId = null;
            if (Guid.TryParse(companyIdClaim, out var parsedCompanyId))
                companyId = parsedCompanyId;
            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized();

            var response = await _service.UpsertAsync(advisorId, companyId, dto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet]
        public async Task<IActionResult> Get(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null,
            int? renewalStatusId = null)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);
            var companyIdClaim = User.FindFirstValue("CompanyId");

            Guid? companyId = Guid.TryParse(companyIdClaim, out var cid)
                    ? cid
                    : null;

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized();

            var response = await _service.GetPagedAsync(
                advisorId, role, companyId, pageNumber, pageSize, search, renewalStatusId);

            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{renewalId:guid}")]
        public async Task<IActionResult> Delete(Guid renewalId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.DeleteAsync(advisorId, renewalId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPatch("{renewalId:guid}/status/{statusId:int}")]
        public async Task<IActionResult> UpdateStatus(Guid renewalId, int statusId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.UpdateStatusAsync(advisorId, renewalId, statusId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("statuses")]
        public async Task<IActionResult> GetStatuses()
        {
            var response = await _service.GetStatusesAsync();
            return StatusCode(response.StatusCode, response);
        }
    }
}
