using Avinya.InsuranceCRM.Application.DTOs.Admin;
using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface IAdminRepository
    {
        Task<(bool IsSuccess, AdminLoginResponseDto? Data, string Message, int StatusCode)> LoginAsync(string email, string password);

        Task<List<PendingAdvisorDto>> GetPendingAdvisorsAsync();
        Task<List<PendingCompanyDto>> GetPendingCompaniesAsync();

        Task<bool> ApproveAsync(string userId, string adminId);
        Task<bool> DeleteAsync(string userId);

        Task<List<AdvisorStatusDto>> GetAdvisorsByStatusAsync(string status, DateTime? from, DateTime? to);
    }
}
