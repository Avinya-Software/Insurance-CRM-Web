using Avinya.InsuranceCRM.Application.RequestModels;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Interfaces.Lead
{
    public interface ILeadService
    {
        Task<ResponseModel> CreateOrUpdateAsync(string advisorId, Guid? companyId, CreateOrUpdateLeadRequest request);
        Task<ResponseModel> GetPagedAsync(
            string advisorId,
            string role,
            Guid? companyId,
            int pageNumber,
            int pageSize,
            string? search,
            string? fullName,
            string? email,
            string? mobile,
            int? leadStatusId,
            int? leadSourceId);

        Task<ResponseModel> DeleteAsync(string advisorId, Guid leadId);
        Task<ResponseModel> UpdateStatusAsync(string advisorId, Guid leadId, int statusId, string? notes);
        Task<ResponseModel> GetLeadStatusesAsync();
        Task<ResponseModel> GetLeadSourcesAsync();
    }
}
