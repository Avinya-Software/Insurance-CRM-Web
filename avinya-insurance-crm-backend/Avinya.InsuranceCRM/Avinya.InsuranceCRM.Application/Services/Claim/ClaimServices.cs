using Avinya.InsuranceCRM.Application.Interfaces.Claim;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Services.Claim
{
    public class ClaimServices : IClaimServices
    {
        private readonly IClaimRepository _repo;

        public ClaimServices(IClaimRepository repo)
        {
            _repo = repo;
        }

        public async Task<ResponseModel> CreateOrUpdateAsync(
            string advisorId,
            Guid? companyId,
            UpsertClaimRequest request)
        {
            if (string.IsNullOrWhiteSpace(advisorId))
                return new ResponseModel(401, "Invalid advisor token");

            if (!companyId.HasValue)
                return new ResponseModel(401, "Invalid CompanyId in token");

            var (claim, isUpdate) =
                await _repo.CreateOrUpdateAsync(
                    advisorId,
                    companyId.Value,
                    request);

            return new ResponseModel(
                200,
                isUpdate
                    ? "Claim updated successfully"
                    : "Claim created successfully",claim);
        }

        public async Task<ResponseModel> GetPagedAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            string? search,
            Guid? customerId,
            Guid? policyId,
            int? claimTypeId,
            int? claimStageId,
            int? claimHandlerId,
            string? status)
        {
            var (data, total) = await _repo.GetPagedAsync(
                advisorId, pageNumber, pageSize, search,
                customerId, policyId, claimTypeId,
                claimStageId, claimHandlerId, status);

            return new ResponseModel(200, "Claims fetched successfully", new
            {
                TotalCount = total,
                Page = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(total / (double)pageSize),
                Data = data
            });
        }

        public async Task<ResponseModel> DeleteAsync(string advisorId, Guid claimId)
            => await _repo.DeleteAsync(advisorId, claimId)
                ? new ResponseModel(200, "Claim deleted successfully")
                : new ResponseModel(404, "Claim not found");

        public async Task<ResponseModel> UpdateStageAsync(
            string advisorId,
            Guid claimId,
            int stageId,
            string? notes)
            => await _repo.UpdateStageAsync(advisorId, claimId, stageId, notes)
                ? new ResponseModel(200, "Claim stage updated successfully")
                : new ResponseModel(404, "Claim not found");

        public async Task<ResponseModel> DeleteDocumentAsync(
            string advisorId,
            Guid claimId,
            string documentId)
            => await _repo.DeleteDocumentAsync(advisorId, claimId, documentId)
                ? new ResponseModel(200, "Document deleted successfully")
                : new ResponseModel(404, "Document not found");

        public IActionResult PreviewDocument(Guid claimId, string documentId)
        {
            var path = _repo.GetDocumentPath(claimId, documentId);
            return path == null ? new NotFoundResult() :
                new PhysicalFileResult(path, "application/octet-stream")
                { EnableRangeProcessing = true };
        }

        public IActionResult DownloadDocument(Guid claimId, string documentId)
        {
            var path = _repo.GetDocumentPath(claimId, documentId);
            return path == null ? new NotFoundResult() :
                new PhysicalFileResult(path, "application/octet-stream")
                { FileDownloadName = Path.GetFileName(path) };
        }
    }
}
