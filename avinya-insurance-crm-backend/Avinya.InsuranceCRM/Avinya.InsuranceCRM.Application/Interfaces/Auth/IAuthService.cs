using System.Security.Claims;
using Avinya.InsuranceCRM.Application.DTOs.Auth;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Interfaces.Auth
{
    public interface IAuthService
    {
        Task<ResponseModel> RegisterAdvisorAsync(RegisterAdvisorRequestDto request, ClaimsPrincipal userClaims);
        Task<ResponseModel> RegisterCompanyAdminAsync(RegisterCompanyRequestDto request);
        Task<ResponseModel> LoginAsync(LoginRequestDto request);
    }
}
