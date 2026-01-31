using Avinya.InsuranceCRM.Application.Interfaces.Admin;
using Avinya.InsuranceCRM.Application.Interfaces.Email;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Domain.Entities;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Services.Admin
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _repo;
        private readonly IEmailService _email;

        public AdminService(IAdminRepository repo, IEmailService email)
        {
            _repo = repo;
            _email = email;
        }

        public async Task<ResponseModel> LoginAsync(AdminLoginRequest request)
        {
            var (ok, data, message, code) = await _repo.LoginAsync(request.Email, request.Password);
            return ok
                ? new ResponseModel(code, message, data)
                : new ResponseModel(code, message);
        }

        public async Task<ResponseModel> GetPendingAdvisorsAsync()
            => new(200, "Pending advisors fetched", await _repo.GetPendingAdvisorsAsync());

        public async Task<ResponseModel> GetPendingCompaniesAsync()
            => new(200, "Pending companies fetched", await _repo.GetPendingCompaniesAsync());

        public async Task<ResponseModel> ApproveAsync(string userId, string adminId)
            => await _repo.ApproveAsync(userId, adminId)
                ? new ResponseModel(200, "Account approved successfully")
                : new ResponseModel(404, "User not found");

        public async Task<ResponseModel> DeleteAsync(string userId)
            => await _repo.DeleteAsync(userId)
                ? new ResponseModel(200, "Account rejected successfully")
                : new ResponseModel(404, "User not found");

        public async Task<ResponseModel> GetAdvisorsByStatusAsync(string status, DateTime? from, DateTime? to)
            => new(200, "Advisor status fetched", await _repo.GetAdvisorsByStatusAsync(status, from, to));
    }
}
