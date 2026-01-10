using Avinya.InsuranceCRM.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface IClaimRepository
    {
        /* ================= READ ================= */

        Task<InsuranceClaim?> GetByIdAsync(
            string advisorId,
            Guid claimId
        );

        Task<(int TotalRecords, List<InsuranceClaim> Data)> GetPagedAsync(
            string advisorId,
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

        /* ================= CREATE / UPDATE ================= */

        Task AddAsync(
            InsuranceClaim claim,
            string advisorId
        );

        Task UpdateAsync(
            InsuranceClaim claim,
            string advisorId
        );

        /* ================= DELETE ================= */

        Task DeleteByIdAsync(
            string advisorId,
            Guid claimId
        );
    }
}
