using Avinya.InsuranceCRM.Application.DTOs.Renewal;

namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface IRenewalRepository
    {
        Task<Guid> UpsertAsync(UpsertRenewalDto dto, string advisorId);
        Task<(List<RenewalListDto> Data, int Total)> GetPagedAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            string? search,
            int? renewalStatusId);

        Task<bool> DeleteAsync(Guid renewalId, string advisorId);
        Task<bool> UpdateStatusAsync(string advisorId, Guid renewalId, int statusId);
        Task<List<RenewalStatusDropdownDto>> GetStatusesAsync();

    }
}
