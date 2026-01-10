using Avinya.InsuranceCRM.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface ICustomerPolicyRepository
    {
        /* ================= READ ================= */

        Task<object> GetPoliciesAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            string? search,
            int? policyStatusId,
            int? policyTypeId,
            Guid? customerId,
            Guid? insurerId,
            Guid? productId
        );

        Task<CustomerPolicy?> GetByIdAsync(
            string advisorId,
            Guid policyId
        );

        Task<List<CustomerPolicy>> GetPoliciesForDropdownAsync(
            string advisorId
        );

        /* ================= CREATE / UPDATE ================= */

        Task<CustomerPolicy> UpsertAsync(
            CustomerPolicy policy,
            string advisorId
        );

        /* ================= DELETE ================= */

        Task DeleteByIdAsync(
            string advisorId,
            Guid policyId
        );

        /* ================= MASTER DATA ================= */

        Task<List<PolicyTypeMaster>> GetPolicyTypesAsync();
        Task<List<PolicyStatusMaster>> GetPolicyStatusesAsync();
    }
}
