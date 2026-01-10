using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface IInsurerRepository
    {
        /* ================= CREATE / UPDATE ================= */

        Task AddAsync(Insurer insurer);
        Task UpdateAsync(Insurer insurer);

        /* ================= READ ================= */

        Task<Insurer?> GetByIdAsync(
            string advisorId,
            Guid insurerId
        );

        Task<PagedRecordResult<Insurer>> GetPagedAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            string? search
        );

        Task<List<Insurer>> GetDropdownAsync(
            string advisorId
        );

        /* ================= DELETE ================= */

        Task<bool> DeleteAsync(
            string advisorId,
            Guid insurerId
        );
    }
}
