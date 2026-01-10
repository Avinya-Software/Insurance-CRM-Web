using Avinya.InsuranceCRM.Domain.Entities;

public interface ICampaignRepository
{
    /* ================= CREATE ================= */

    Task<Campaign> CreateCampaignAsync(
        string advisorId,
        Campaign campaign,
        List<CampaignTemplate> templates,
        List<CampaignRule> rules,
        List<Guid>? customerIds);

    /* ================= READ ================= */

    Task<Campaign?> GetByIdAsync(
        Guid campaignId,
        string advisorId);

    Task<(List<Campaign> Items, int TotalCount)> GetPagedAsync(
        string advisorId,
        int pageNumber,
        int pageSize,
        string? search);

    Task<CampaignCreateRequest?> GetForUpsertAsync(
        Guid campaignId);

    Task<List<(Guid CampaignId, string Name)>> GetDropdownAsync(
        string advisorId);

    Task<List<(int CampaignTypeId, string Name)>> GetCampaignTypeDropdownAsync();

    /* ================= UPDATE ================= */

    Task UpdateCampaignAsync(
        Guid campaignId,
        string advisorId,
        Campaign campaign,
        List<CampaignTemplate> templates,
        List<CampaignRule> rules,
        List<Guid>? customerIds);

    /* ================= DELETE ================= */

    Task DeleteCampaignAsync(
        Guid campaignId,
        string advisorId);
}
