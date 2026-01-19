using Avinya.InsuranceCRM.API.Models;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Helpers;
using Avinya.InsuranceCRM.Infrastructure.Identity;
using Avinya.InsuranceCRM.Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AdminController> _logger;

        public AdminController(
            IAdminService adminService,
            UserManager<ApplicationUser> userManager,
            IEmailService emailService,
            IConfiguration configuration,
            ILogger<AdminController> logger)
        {
            _adminService = adminService;
            _userManager = userManager;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
        }

        /* ================= LOGIN ================= */

        [HttpPost("login")]
        public async Task<IActionResult> Login(AdminLoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return Unauthorized(ApiResponse<string>.Fail(401, "Invalid credentials"));

            if (!await _userManager.IsInRoleAsync(user, "SuperAdmin"))
                return Unauthorized(ApiResponse<string>.Fail(403, "Not an admin account"));

            if (!user.IsActive)
                return Unauthorized(ApiResponse<string>.Fail(403, "Admin account is disabled"));

            if (!await _userManager.CheckPasswordAsync(user, request.Password))
                return Unauthorized(ApiResponse<string>.Fail(401, "Invalid credentials"));

            var (token, expiresAt) =
                JwtTokenHelper.GenerateAdminToken(user, _configuration);

            return Ok(ApiResponse<object>.Success(new
            {
                user.Email,
                Token = token,
                ExpiresAt = expiresAt
            }, "Admin login successful"));
        }

        /* ================= PENDING ADVISORS ================= */

        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("pending-advisors")]
        public async Task<IActionResult> PendingAdvisors()
        {
            var result = await _adminService.GetPendingAdvisorsAsync();
            return Ok(ApiResponse<object>.Success(result));
        }

        /* ================= PENDING COMPANIES ================= */

        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("pending-companies")]
        public async Task<IActionResult> PendingCompanies()
        {
            var result = await _adminService.GetPendingCompaniesAsync();
            return Ok(ApiResponse<object>.Success(result));
        }

        /* ================= APPROVE ADVISOR / COMPANY ADMIN ================= */

        [Authorize(Roles = "SuperAdmin")]
        [HttpPost("approve/{userId}")]
        public async Task<IActionResult> Approve(string userId)
        {
            var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            await _adminService.ApproveUserAsync(userId, adminId);

            var user = await _userManager.FindByIdAsync(userId);
            if (user != null && !string.IsNullOrWhiteSpace(user.Email))
            {
                await _emailService.SendAdvisorApprovalEmailAsync(user.Email);
            }

            return Ok(ApiResponse<string>.Success("Account approved successfully"));
        }

        /* ================= REJECT / DISABLE ================= */

        [Authorize(Roles = "SuperAdmin")]
        [HttpDelete("delete/{userId}")]
        public async Task<IActionResult> Delete(string userId)
        {
            await _adminService.DisableUserAsync(userId);

            var user = await _userManager.FindByIdAsync(userId);
            if (user != null && !string.IsNullOrWhiteSpace(user.Email))
            {
                await _emailService.SendAdvisorRejectionEmailAsync(user.Email);
            }

            return Ok(ApiResponse<string>.Success("Account rejected successfully"));
        }

        /* ================= ADVISORS BY STATUS ================= */

        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("advisors-by-status")]
        public async Task<IActionResult> GetAdvisorsByStatus(
            [FromQuery] string status,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate)
        {
            if (string.IsNullOrWhiteSpace(status))
                return BadRequest("Status is required (approved / rejected)");

            var result = await _adminService.GetAdvisorsByStatusAsync(
                status.ToLower(),
                fromDate,
                toDate);

            return Ok(ApiResponse<object>.Success(result));
        }
    }
}
