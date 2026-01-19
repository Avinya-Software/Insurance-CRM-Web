using Avinya.InsuranceCRM.API.Models;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Helpers;
using Avinya.InsuranceCRM.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdvisorController : ControllerBase
    {
        private readonly IAdvisorRepository _advisorRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AdvisorController> _logger;
        private readonly AppDbContext _context;

        public AdvisorController(
            IAdvisorRepository advisorRepository,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            ILogger<AdvisorController> logger,
            AppDbContext context)
        {
            _advisorRepository = advisorRepository;
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
            _context = context;
        }

        // =========================
        // REGISTER ADVISOR (COMPANY)
        // =========================
        [Authorize(Roles = "CompanyAdmin")]
        [HttpPost("register-advisor")]
        public async Task<IActionResult> RegisterAdvisor(AdvisorRegisterRequest request)
        {
            // 🔐 Get CompanyId from JWT
            var companyIdClaim = User.FindFirst("CompanyId")?.Value;
            if (string.IsNullOrEmpty(companyIdClaim))
            {
                return Unauthorized(ApiResponse<string>.Fail(
                    401,
                    "Company context missing in token"
                ));
            }

            var companyId = Guid.Parse(companyIdClaim);

            // 🔍 Check if user already exists
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                var roles = await _userManager.GetRolesAsync(existingUser);

                // ❌ One email = one role
                if (roles.Any())
                {
                    return BadRequest(ApiResponse<string>.Fail(
                        400,
                        $"User already registered with role: {roles.First()}"
                    ));
                }
            }

            // 1️⃣ Create Identity User
            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                CompanyId = companyId,    // ✅ FROM JWT
                IsApproved = true,
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return BadRequest(ApiResponse<string>.Fail(
                    400,
                    string.Join(", ", result.Errors.Select(e => e.Description))
                ));
            }

            await _userManager.AddToRoleAsync(user, "Advisor");

            // 2️⃣ Create Advisor Profile
            var advisor = new Advisor
            {
                AdvisorId = Guid.NewGuid(),
                UserId = user.Id,
                CompanyId = companyId,    // ✅ FROM JWT
                FullName = request.FullName,
                MobileNumber = request.MobileNumber,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _advisorRepository.AddAsync(advisor);

            return Ok(ApiResponse<object>.Success(new
            {
                advisor.AdvisorId,
                advisor.FullName,
                CompanyId = companyId
            }, "Advisor registered successfully under company"));
        }


        // =========================
        // REGISTER (COMPANY ADMIN)
        // =========================
        // ❗ One Email = One Role (STRICT)
        [HttpPost("register-company")]
        public async Task<IActionResult> RegisterCompanyAdmin(CompanyRegisterRequest request)
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);

            if (existingUser != null)
            {
                var roles = await _userManager.GetRolesAsync(existingUser);

                // ❌ Block if user already has ANY role
                if (roles.Any())
                {
                    return BadRequest(ApiResponse<string>.Fail(
                        400,
                        $"User already registered with role: {roles.First()}"
                    ));
                }
            }

            // 1️⃣ Create Company
            var company = new Company
            {
                CompanyId = Guid.NewGuid(),
                CompanyName = request.CompanyName,
                CreatedAt = DateTime.UtcNow
            };

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            // 2️⃣ Create CompanyAdmin user (NOT approved)
            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                IsApproved = false, // needs SuperAdmin approval
                IsActive = true,
                CompanyId = company.CompanyId
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return BadRequest(ApiResponse<string>.Fail(
                    400,
                    string.Join(", ", result.Errors.Select(e => e.Description))
                ));
            }

            await _userManager.AddToRoleAsync(user, "CompanyAdmin");

            return Ok(ApiResponse<object>.Success(new
            {
                company.CompanyId,
                company.CompanyName,
                user.Email,
                Role = "CompanyAdmin",
                Status = "Pending SuperAdmin approval"
            }, "Company registered successfully. Await SuperAdmin approval"));
        }

        // =========================
        // LOGIN (ADVISOR / COMPANY)
        // =========================
        [HttpPost("login")]
        public async Task<IActionResult> Login(AdvisorLoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null || !user.IsActive)
            {
                return Unauthorized(ApiResponse<string>.Fail(401, "Invalid credentials"));
            }

            var isValid = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!isValid)
            {
                return Unauthorized(ApiResponse<string>.Fail(401, "Invalid credentials"));
            }

            var roles = await _userManager.GetRolesAsync(user);

            if (!roles.Any())
            {
                return Unauthorized(ApiResponse<string>.Fail(403, "No role assigned to user"));
            }

            // Approval rule
            if (roles.Contains("CompanyAdmin") && !user.IsApproved)
            {
                return Unauthorized(ApiResponse<string>.Fail(
                    403,
                    "CompanyAdmin account pending SuperAdmin approval"
                ));
            }

            Advisor? advisor = null;
            if (roles.Contains("Advisor"))
            {
                advisor = await _advisorRepository.GetByUserIdAsync(user.Id);
            }

            var (token, expiresAt) =
     await JwtTokenHelper.GenerateBaseToken(user, _userManager, _configuration);


            return Ok(ApiResponse<object>.Success(new
            {
                userId = user.Id,
                user.Email,
                user.CompanyId,
                user.IsApproved,
                Role = roles.First(), // ✅ guaranteed ONE role
                AdvisorProfile = advisor == null ? null : new
                {
                    advisor.AdvisorId,
                    advisor.FullName,
                    advisor.MobileNumber
                },
                Token = token,
                ExpiresAt = expiresAt
            }, "Login successful"));
        }
    }
}
