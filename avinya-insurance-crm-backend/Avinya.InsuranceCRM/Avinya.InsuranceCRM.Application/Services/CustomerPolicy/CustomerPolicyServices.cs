using Avinya.InsuranceCRM.Application.DTOs.CustomerPolicy;
using Avinya.InsuranceCRM.Application.Interfaces.CustomerPolicy;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Services.CustomerPolicy
{
    public class CustomerPolicyServices : ICustomerPolicyServices
    {
        private readonly ICustomerPolicyRepository _repo;

        public CustomerPolicyServices(ICustomerPolicyRepository repo)
        {
            _repo = repo;
        }

        public async Task<ResponseModel> GetPoliciesAsync(
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
            Guid? productId)
        {
            var data = await _repo.GetPoliciesAsync(
                advisorId,
                role,
                companyId,
                pageNumber,
                pageSize,
                search,
                policyStatusId,
                policyTypeId,
                customerId,
                insurerId,
                productId);

            return new ResponseModel(200, "Policies fetched successfully", data);
        }

        public async Task<ResponseModel> CreateOrUpdateAsync(
    string advisorId,
    Guid? companyId,
    UpsertPolicyRequest request)
        {
            if (string.IsNullOrWhiteSpace(advisorId))
                return new ResponseModel(401, "Invalid advisor token");

            if (!companyId.HasValue)
                return new ResponseModel(401, "Invalid CompanyId in token");

            var (policy, isUpdate) =
                await _repo.CreateOrUpdateAsync(
                    advisorId,
                    companyId.Value,
                    request);

            return new ResponseModel(
                200,
                isUpdate
                    ? "Policy updated successfully"
                    : "Policy created successfully",policy);
        }

        public async Task<ResponseModel> DeleteAsync(
            string advisorId,
            Guid policyId)
            => await _repo.DeleteByIdAsync(advisorId, policyId)
                ? new ResponseModel(200, "Policy deleted successfully")
                : new ResponseModel(404, "Policy not found");

        public async Task<ResponseModel> DeleteDocumentAsync(
            string advisorId,
            Guid policyId,
            string documentId)
            => await _repo.DeleteDocumentAsync(advisorId, policyId, documentId)
                ? new ResponseModel(200, "Policy document deleted successfully")
                : new ResponseModel(404, "Document not found");


        public async Task<ResponseModel> GetPolicyTypesAsync()
            => new ResponseModel(200, "Fetched successfully",
                await _repo.GetPolicyTypesAsync());

        public async Task<ResponseModel> GetPolicyStatusesAsync()
            => new ResponseModel(200, "Fetched successfully",
                await _repo.GetPolicyStatusesAsync());

        public async Task<ResponseModel> GetDropdownAsync(
            string advisorId,
            Guid? customerId)
            => new ResponseModel(200, "Fetched successfully",
                await _repo.GetPoliciesForDropdownAsync(advisorId, customerId));

        public IActionResult PreviewDocument(Guid policyId, string documentId)
        {
            var path = _repo.GetPolicyDocumentPath(policyId, documentId);
            if (path == null) return new NotFoundResult();

            return new PhysicalFileResult(path, GetContentType(path))
            {
                EnableRangeProcessing = true
            };
        }

        public IActionResult DownloadDocument(Guid policyId, string documentId)
        {
            var path = _repo.GetPolicyDocumentPath(policyId, documentId);
            if (path == null) return new NotFoundResult();

            return new PhysicalFileResult(path, GetContentType(path))
            {
                FileDownloadName = Path.GetFileName(path)
            };
        }

        private static string GetContentType(string path)
        {
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return ext switch
            {
                ".pdf" => "application/pdf",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream"
            };
        }
    }
}
