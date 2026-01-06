using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface IRenewalRepository
    {
        // UPSERT
        Task<Renewal> UpsertAsync(Renewal renewal, string userId);

        // LIST WITH FILTERS
        Task<object> GetRenewalsAsync(
            int pageNumber,
            int pageSize,
            string? search,
            int? renewalStatusId
        );

        // MASTER DROPDOWN
        Task<List<RenewalStatusMaster>> GetRenewalStatusesAsync();
    }
}
