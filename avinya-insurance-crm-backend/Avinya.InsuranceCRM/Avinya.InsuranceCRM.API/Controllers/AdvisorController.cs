using Avinya.InsuranceCRM.API.Helpers;
using Avinya.InsuranceCRM.API.Models;
using Avinya.InsuranceCRM.API.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Identity;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
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

        public AdvisorController(
            IAdvisorRepository advisorRepository,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            ILogger<AdvisorController> logger)
        {
            _advisorRepository = advisorRepository;
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
        }

        //   REGISTER  
        [HttpPost("register")]
        public async Task<IActionResult> Register(AdvisorRegisterRequest request)
        {
            _logger.LogInformation("Advisor registration attempt: {Email}", request.Email);

            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return BadRequest(
                    ApiResponse<string>.Fail(400, "Email already registered")
                );
            }

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                IsApproved = false, // 🔥 must be approved by SuperAdmin
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(
                    ApiResponse<string>.Fail(
                        400,
                        string.Join(", ", result.Errors.Select(e => e.Description))
                    )
                );
            }

            await _userManager.AddToRoleAsync(user, "Advisor");

            var advisor = new Advisor
            {
                AdvisorId = Guid.NewGuid(),
                UserId = user.Id,
                FullName = request.FullName,
                MobileNumber = request.MobileNumber,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _advisorRepository.AddAsync(advisor);

            return Ok(
                ApiResponse<string>.Success(
                    "Registration successful. Await admin approval."
                )
            );
        }

        //   LOGIN  
        [HttpPost("login")]
        public async Task<IActionResult> Login(AdvisorLoginRequest request)
        {
            _logger.LogInformation("Advisor login attempt: {Email}", request.Email);

            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                return Unauthorized(
                    ApiResponse<string>.Fail(401, "Invalid email or password")
                );
            }

            if (!user.IsApproved)
            {
                return Unauthorized(
                    ApiResponse<string>.Fail(403, "Account pending admin approval")
                );
            }

            if (!user.IsActive)
            {
                return Unauthorized(
                    ApiResponse<string>.Fail(403, "Account is disabled")
                );
            }

            var isValid = await _userManager.CheckPasswordAsync(user, request.Password);

            if (!isValid)
            {
                return Unauthorized(
                    ApiResponse<string>.Fail(401, "Invalid email or password")
                );
            }

            var advisor = await _advisorRepository.GetByUserIdAsync(user.Id);

            if (advisor == null)
            {
                return Unauthorized(
                    ApiResponse<string>.Fail(401, "Advisor profile not found")
                );
            }

            var (token, expiresAt) =
                JwtTokenHelper.GenerateToken(user, advisor, _configuration);

            return Ok(
                ApiResponse<object>.Success(new
                {
                    advisor.AdvisorId,
                    advisor.FullName,
                    advisor.MobileNumber,
                    user.Email,
                    Token = token,
                    ExpiresAt = expiresAt
                }, "Login successful")
            );
        }
    }
}
