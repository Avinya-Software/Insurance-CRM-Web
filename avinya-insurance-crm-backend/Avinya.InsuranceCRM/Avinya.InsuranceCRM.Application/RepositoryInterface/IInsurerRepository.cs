using Avinya.InsuranceCRM.Application.DTOs;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface IInsurerRepository
    {
        Task<Insurer?> GetByIdAsync(string advisorId, Guid insurerId);
        Task<(Insurer insurer, bool isUpdate)> CreateOrUpdateAsync(
        string advisorId,
        Guid companyId,
        CreateOrUpdateInsurerRequest request);
        Task<bool> DeleteAsync(string advisorId, Guid insurerId);
        Task<List<InsurerDropdown>> GetDropdownAsync(string advisorId);

        Task<(IEnumerable<InsurerListDto> Insurers, int TotalCount)>
        GetFilteredAsync(
            string advisorId,
            string role,
            Guid? companyId,
            string? search,
            int page,
            int pageSize);
    }
}
