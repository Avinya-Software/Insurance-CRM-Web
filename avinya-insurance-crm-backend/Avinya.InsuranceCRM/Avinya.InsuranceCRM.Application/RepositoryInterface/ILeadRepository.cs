using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Application.DTOs;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface ILeadRepository
    {
        Task<(Lead lead, bool isUpdate)> CreateOrUpdateAsync(
        string advisorId,
        Guid? companyId,
        CreateOrUpdateLeadRequest request);

        Task<(IEnumerable<LeadListDto> Data, int TotalCount)> GetPagedAsync(
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

        Task<bool> DeleteAsync(string advisorId, Guid leadId);
        Task<List<LeadStatus>> GetLeadStatusesAsync();
        Task<List<LeadSource>> GetLeadSourcesAsync();
        Task<bool> UpdateLeadStatusAsync(string advisorId, Guid leadId, int statusId, string? notes);
    }
}
