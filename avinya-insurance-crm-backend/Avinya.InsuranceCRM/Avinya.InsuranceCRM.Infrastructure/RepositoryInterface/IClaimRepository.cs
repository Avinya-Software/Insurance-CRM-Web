using Avinya.InsuranceCRM.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface IClaimRepository
    {
        Task<InsuranceClaim?> GetByIdAsync(Guid claimId);
        Task AddAsync(InsuranceClaim claim);
        Task UpdateAsync(InsuranceClaim claim);
        Task<(int TotalRecords, List<InsuranceClaim> Data)> GetPagedAsync(
           int pageNumber,
           int pageSize,
           string? search,
           Guid? customerId,
           Guid? policyId,
           int? claimTypeId,
           int? claimStageId,
           int? claimHandlerId,
           string? status
        );
        Task DeleteByIdAsync(Guid claimId);

    }
}
