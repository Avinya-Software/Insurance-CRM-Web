using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface ILeadRepository
    {
        /* ================= CREATE / UPDATE ================= */

        Task AddAsync(Lead lead);
        Task UpdateAsync(Lead lead);

        /* ================= READ ================= */

        Task<Lead?> GetByIdAsync(
            string advisorId,
            Guid leadId
        );

        Task<PagedRecordResult<Lead>> GetPagedAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            string? search,
            string? fullName,
            string? email,
            string? mobile,
            int? leadStatusId,
            int? leadSourceId
        );

        /* ================= DELETE ================= */

        Task<bool> DeleteAsync(
            string advisorId,
            Guid leadId
        );

        /* ================= HELPERS ================= */

        Task<string> GenerateLeadNoAsync();

        Task<List<LeadStatus>> GetLeadStatusesAsync();
        Task<List<LeadSource>> GetLeadSourcesAsync();
    }
}
