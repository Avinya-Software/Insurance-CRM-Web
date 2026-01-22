using Avinya.InsuranceCRM.Application.DTOs.CustomerPolicy;
using Microsoft.AspNetCore.Mvc;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Interfaces.CustomerPolicy
{
    public interface ICustomerPolicyServices
    {
        Task<ResponseModel> GetPoliciesAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            string? search,
            int? policyStatusId,
            int? policyTypeId,
            Guid? customerId,
            Guid? insurerId,
            Guid? productId);

        Task<ResponseModel> CreateOrUpdateAsync(
            string advisorId,
            Guid? companyId,
            UpsertPolicyRequest request);

        Task<ResponseModel> DeleteAsync(
            string advisorId,
            Guid policyId);

        Task<ResponseModel> DeleteDocumentAsync(
            string advisorId,
            Guid policyId,
            string documentId);


        Task<ResponseModel> GetPolicyTypesAsync();
        Task<ResponseModel> GetPolicyStatusesAsync();
        Task<ResponseModel> GetDropdownAsync(string advisorId, Guid? customerId);

        IActionResult PreviewDocument(Guid policyId, string documentId);
        IActionResult DownloadDocument(Guid policyId, string documentId);
    }
}
