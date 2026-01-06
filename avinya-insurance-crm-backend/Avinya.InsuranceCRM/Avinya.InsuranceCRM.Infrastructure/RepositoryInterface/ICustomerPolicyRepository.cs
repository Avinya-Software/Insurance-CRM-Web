using Avinya.InsuranceCRM.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface ICustomerPolicyRepository
    {
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
        Task<CustomerPolicy> UpsertAsync(
            CustomerPolicy policy,
            string advisorId
        );
        Task<CustomerPolicy?> GetByIdAsync(Guid policyId);
        Task DeleteByIdAsync(Guid policyId, string advisorId);
        Task<List<PolicyTypeMaster>> GetPolicyTypesAsync();
        Task<List<PolicyStatusMaster>> GetPolicyStatusesAsync();
        Task<List<CustomerPolicy>> GetPoliciesForDropdownAsync(string advisorId);
    }
}
