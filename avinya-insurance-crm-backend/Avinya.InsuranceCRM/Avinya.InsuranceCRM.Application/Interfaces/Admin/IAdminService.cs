using Avinya.InsuranceCRM.Application.DTOs.Admin;
using Avinya.InsuranceCRM.Domain.Entities;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Interfaces.Admin
{
    public interface IAdminService
    {
        Task<ResponseModel> LoginAsync(AdminLoginRequest request);
        Task<ResponseModel> GetPendingAdvisorsAsync();
        Task<ResponseModel> GetPendingCompaniesAsync();
        Task<ResponseModel> ApproveAsync(string userId, string adminId);
        Task<ResponseModel> DeleteAsync(string userId);
        Task<ResponseModel> GetAdvisorsByStatusAsync(string status, DateTime? from, DateTime? to);
    }
}
