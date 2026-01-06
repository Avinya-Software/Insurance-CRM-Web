using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface ILeadRepository
    {
        Task<Lead?> GetByIdAsync(Guid leadId);
        Task AddAsync(Lead lead);
        Task UpdateAsync(Lead lead);

        Task<PagedRecordResult<Lead>> GetPagedAsync(
    int pageNumber,
    int pageSize,
    string? search,
    string? fullName,
    string? email,
    string? mobile,
    int? leadStatusId,
    int? leadSourceId
);

        Task<string> GenerateLeadNoAsync();
        Task<bool> DeleteAsync(Guid leadId);
        Task<List<LeadStatus>> GetLeadStatusesAsync();
        Task<List<LeadSource>> GetLeadSourcesAsync();
    }

}
