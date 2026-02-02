using System.Security.Claims;
using Avinya.InsuranceCRM.Application.DTOs.Auth;
using Avinya.InsuranceCRM.Application.Interfaces.Auth;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _repo;

        public AuthService(IAuthRepository repo)
        {
            _repo = repo;
        }

        public async Task<ResponseModel> RegisterAdvisorAsync(RegisterAdvisorRequestDto request, ClaimsPrincipal userClaims)
        {
            var result = await _repo.RegisterAdvisorAsync(request, userClaims);

            return result.IsSuccess
                ? new ResponseModel(200, "Advisor registered successfully")
                : new ResponseModel(400, result.Message);
        }

        public async Task<ResponseModel> RegisterCompanyAdminAsync(RegisterCompanyRequestDto request)
        {
            var result = await _repo.RegisterCompanyAdminAsync(request);

            return result.IsSuccess
                ? new ResponseModel(200, "Company registered successfully. Await SuperAdmin approval")
                : new ResponseModel(400, result.Message);
        }

        public async Task<ResponseModel> LoginAsync(LoginRequestDto request)
        {
            var result = await _repo.LoginAsync(request);

            return result.IsSuccess
                ? new ResponseModel(200, result.Message, result.Data)
                : new ResponseModel(401, result.Message);
        }
    }
}
