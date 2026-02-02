using System.Security.Claims;
using Avinya.InsuranceCRM.Application.DTOs.Auth;
using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface IAuthRepository
    {
        Task<(bool IsSuccess, string Message)> RegisterAdvisorAsync(RegisterAdvisorRequestDto request, ClaimsPrincipal userClaims);
        Task<(bool IsSuccess, string Message)> RegisterCompanyAdminAsync(RegisterCompanyRequestDto request);
        Task<(bool IsSuccess, string Message, AuthResponseDto? Data)> LoginAsync(LoginRequestDto request);
    }
}
