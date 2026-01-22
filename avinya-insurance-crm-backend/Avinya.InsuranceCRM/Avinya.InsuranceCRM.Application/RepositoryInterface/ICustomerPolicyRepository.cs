using Avinya.InsuranceCRM.Application.DTOs.CustomerPolicy;
using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface ICustomerPolicyRepository
    {
        Task<object> GetPoliciesAsync(
            string advisorId,
            string role,
            Guid? companyId,
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
            string advisorId,
            Guid? customerId
        );

        Task<(PolicyUpsertResponseDto response, bool isUpdate)> CreateOrUpdateAsync(
            string advisorId,
            Guid companyId,
            UpsertPolicyRequest request);

        Task<bool> DeleteByIdAsync(
            string advisorId,
            Guid policyId
        );

        Task<bool> DeleteDocumentAsync(
            string advisorId,
            Guid policyId,
            string documentId
        );
        string? GetPolicyDocumentPath(
            Guid policyId,
            string documentId
        );
        Task<List<PolicyTypeMaster>> GetPolicyTypesAsync();
        Task<List<PolicyStatusMaster>> GetPolicyStatusesAsync();
    }
}
