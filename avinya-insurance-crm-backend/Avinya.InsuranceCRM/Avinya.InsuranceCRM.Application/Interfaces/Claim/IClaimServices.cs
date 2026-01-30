using Avinya.InsuranceCRM.Application.RequestModels;
using Microsoft.AspNetCore.Mvc;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Interfaces.Claim
{
    public interface IClaimServices
    {
        Task<ResponseModel> CreateOrUpdateAsync(
            string advisorId,
            Guid? companyId,
            UpsertClaimRequest request);

        Task<ResponseModel> GetPagedAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            string? search,
            Guid? customerId,
            Guid? policyId,
            int? claimTypeId,
            int? claimStageId,
            int? claimHandlerId,
            string? status);

        Task<ResponseModel> DeleteAsync(string advisorId, Guid claimId);

        Task<ResponseModel> UpdateStageAsync(
            string advisorId,
            Guid claimId,
            int stageId,
            string? notes);

        Task<ResponseModel> DeleteDocumentAsync(
            string advisorId,
            Guid claimId,
            string documentId);

        Task<ResponseModel> PreviewDocument(Guid claimId, string documentId);
        Task<ResponseModel> DownloadDocument(Guid claimId, string documentId);
    }
}
