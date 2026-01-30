using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface IClaimRepository
    {
        Task<(UpsertClaimRequest claim, bool isUpdate)> CreateOrUpdateAsync(
        string advisorId,
        Guid companyId,
        UpsertClaimRequest request);

        Task<(IEnumerable<InsuranceClaim> Data, int TotalCount)> GetPagedAsync(
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

        Task<bool> DeleteAsync(string advisorId, Guid claimId);

        Task<bool> UpdateStageAsync(
            string advisorId,
            Guid claimId,
            int stageId,
            string? notes);

        Task<bool> DeleteDocumentAsync(
            string advisorId,
            Guid claimId,
            string documentId);

        string? GetDocumentBase64(Guid claimId, string documentId);
    }
}
