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
    public interface IInsurerRepository
    {
        Task<Insurer?> GetByIdAsync(Guid insurerId);
        Task AddAsync(Insurer insurer);
        Task UpdateAsync(Insurer insurer);
        Task<PagedRecordResult<Insurer>> GetPagedAsync(int pageNumber,int pageSize,string? search);
        Task<List<Insurer>> GetDropdownAsync();
        Task<bool> DeleteAsync(Guid insurerId);
    }
}
