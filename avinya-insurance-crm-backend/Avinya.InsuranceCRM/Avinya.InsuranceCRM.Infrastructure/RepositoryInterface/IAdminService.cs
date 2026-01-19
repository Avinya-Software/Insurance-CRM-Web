using Avinya.InsuranceCRM.Application.DTOs.Admin;
using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface IAdminService
    {
        /* ================= ADVISORS ================= */

        Task<List<PendingAdvisorDto>> GetPendingAdvisorsAsync();

        Task<List<AdvisorStatusDto>> GetAdvisorsByStatusAsync(
            string status,
            DateTime? fromDate,
            DateTime? toDate);

        /* ================= COMPANIES ================= */

        Task<List<PendingCompanyDto>> GetPendingCompaniesAsync();

        /* ================= APPROVAL / REJECTION ================= */

        Task ApproveUserAsync(string userId, string approvedBy);
        Task DisableUserAsync(string userId);
    }
}
