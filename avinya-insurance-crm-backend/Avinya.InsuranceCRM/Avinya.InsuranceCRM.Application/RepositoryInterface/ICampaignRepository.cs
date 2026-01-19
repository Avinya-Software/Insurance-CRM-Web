using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface ICampaignRepository
    {
        /* ================= CREATE ================= */

        Task<Campaign> CreateCampaignAsync(
            Guid companyId,
            string userId,
            string role,
            Campaign campaign,
            List<CampaignTemplate> templates,
            List<CampaignRule> rules,
            List<Guid>? customerIds);

        /* ================= READ ================= */

        Task<Campaign?> GetByIdAsync(
            Guid campaignId,
            Guid companyId,
            string userId,
            string role);

        Task<(List<Campaign> Items, int TotalCount)> GetPagedAsync(
            Guid companyId,
            string userId,
            string role,
            int pageNumber,
            int pageSize,
            string? search);

        Task<CampaignCreateRequest?> GetForUpsertAsync(
            Guid campaignId);

        Task<List<(Guid CampaignId, string Name)>> GetDropdownAsync(
            Guid companyId,
            string userId,
            string role);

        Task<List<(int CampaignTypeId, string Name)>> GetCampaignTypeDropdownAsync();

        /* ================= UPDATE ================= */

        Task UpdateCampaignAsync(
            Guid campaignId,
            Guid companyId,
            string userId,
            string role,
            Campaign campaign,
            List<CampaignTemplate> templates,
            List<CampaignRule> rules,
            List<Guid>? customerIds);

        /* ================= DELETE ================= */

        Task DeleteCampaignAsync(
            Guid campaignId,
            Guid companyId,
            string userId,
            string role);
    }
}
