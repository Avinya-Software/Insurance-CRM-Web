using Avinya.InsuranceCRM.Application.Interfaces.Insurer;
using Avinya.InsuranceCRM.Application.RequestModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "ApprovedAdvisorOrCompanyAdmin")]
    public class InsurerController : ControllerBase
    {
        private readonly IInsurerService _service;

        public InsurerController(IInsurerService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrUpdate(CreateOrUpdateInsurerRequest request)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var companyIdClaim = User.FindFirstValue("CompanyId");
            Guid? companyId = null;
            if (Guid.TryParse(companyIdClaim, out var parsedCompanyId))
                companyId = parsedCompanyId;

            var response = await _service.CreateOrUpdateAsync(advisorId, companyId, request);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id:guid}/portal-password")]
        public async Task<IActionResult> GetPortalPassword(Guid id)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.GetPortalPasswordAsync(advisorId, id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet]
        public async Task<IActionResult> GetPaged(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);
            var companyIdClaim = User.FindFirstValue("CompanyId");

            Guid? companyId = Guid.TryParse(companyIdClaim, out var cid)
                ? cid
                : null;

            var response = await _service.GetFilteredAsync(
                advisorId,
                role,
                companyId,
                search,
                pageNumber,
                pageSize);

            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("dropdown")]
        public async Task<IActionResult> GetDropdown()
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.GetDropdownAsync(advisorId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.DeleteAsync(advisorId, id);
            return StatusCode(response.StatusCode, response);
        }
    }
}
