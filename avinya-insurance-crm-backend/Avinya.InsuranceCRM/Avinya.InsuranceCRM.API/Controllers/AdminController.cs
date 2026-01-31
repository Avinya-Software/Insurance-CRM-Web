using Avinya.InsuranceCRM.Application.Interfaces.Admin;
using Avinya.InsuranceCRM.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _service;

        public AdminController(IAdminService service)
        {
            _service = service;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(AdminLoginRequest request)
            => Ok(await _service.LoginAsync(request));

        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("pending-advisors")]
        public async Task<IActionResult> PendingAdvisors()
            => Ok(await _service.GetPendingAdvisorsAsync());

        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("pending-companies")]
        public async Task<IActionResult> PendingCompanies()
            => Ok(await _service.GetPendingCompaniesAsync());

        [Authorize(Roles = "SuperAdmin")]
        [HttpPost("approve/{userId}")]
        public async Task<IActionResult> Approve(string userId)
        {
            var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            return Ok(await _service.ApproveAsync(userId, adminId));
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpDelete("delete/{userId}")]
        public async Task<IActionResult> Delete(string userId)
        {
            return Ok(await _service.DeleteAsync(userId));
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("advisors-by-status")]
        public async Task<IActionResult> GetAdvisorsByStatus(string status, DateTime? fromDate, DateTime? toDate)
            => Ok(await _service.GetAdvisorsByStatusAsync(status.ToLower(), fromDate, toDate));
    }
}
