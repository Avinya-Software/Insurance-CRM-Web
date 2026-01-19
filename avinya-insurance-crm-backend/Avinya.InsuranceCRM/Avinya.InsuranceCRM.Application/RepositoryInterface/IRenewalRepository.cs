using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface IRenewalRepository
    {
        /* ================= UPSERT ================= */

        Task<Renewal> UpsertAsync(
            Renewal renewal,
            string advisorId
        );

        /* ================= LIST WITH FILTERS ================= */

        Task<object> GetRenewalsAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            string? search,
            int? renewalStatusId
        );

        /* ================= SINGLE FETCH ================= */

        Task<Renewal?> GetByIdAsync(
            Guid renewalId,
            string advisorId
        );

        /* ================= DELETE ================= */

        Task DeleteByIdAsync(
            Guid renewalId,
            string advisorId
        );

        /* ================= MASTER DROPDOWN ================= */

        Task<List<RenewalStatusMaster>> GetRenewalStatusesAsync();
        Task<bool> UpdateRenewalStatusAsync(
        string advisorId,
        Guid renewalId,
        int renewalStatusId
    );

    }
}
