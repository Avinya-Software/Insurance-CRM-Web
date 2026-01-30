using Avinya.InsuranceCRM.Application.DTOs.Renewal;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Interfaces.Renewal
{
    public interface IRenewalService
    {
        Task<ResponseModel> UpsertAsync(
            string advisorId,
            UpsertRenewalDto dto);
        Task<ResponseModel> GetPagedAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            string? search,
            int? statusId);

        Task<ResponseModel> DeleteAsync(string advisorId, Guid renewalId);
        Task<ResponseModel> GetStatusesAsync();
        Task<ResponseModel> UpdateStatusAsync(
            string advisorId,
            Guid renewalId,
            int statusId);
    }
}
