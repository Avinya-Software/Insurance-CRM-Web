using Avinya.InsuranceCRM.Application.DTOs.Auth;
using Avinya.InsuranceCRM.Application.Interfaces.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [Authorize(Roles = "CompanyAdmin")]
        [HttpPost("register-advisor")]
        public async Task<IActionResult> RegisterAdvisor(RegisterAdvisorRequestDto request)
        {
            var response = await _authService.RegisterAdvisorAsync(request, User);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("register-company")]
        public async Task<IActionResult> RegisterCompany(RegisterCompanyRequestDto request)
        {
            var response = await _authService.RegisterCompanyAdminAsync(request);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto request)
        {
            var response = await _authService.LoginAsync(request);
            return StatusCode(response.StatusCode, response);
        }
    }
}
