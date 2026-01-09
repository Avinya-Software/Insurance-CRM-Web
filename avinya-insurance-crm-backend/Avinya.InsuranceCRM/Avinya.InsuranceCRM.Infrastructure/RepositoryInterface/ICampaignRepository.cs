using Avinya.InsuranceCRM.Domain.Entities;

public interface ICampaignRepository
{
    Task<Campaign> CreateCampaignAsync(
        Campaign campaign,
        List<CampaignTemplate> templates,
        List<CampaignRule> rules,
        List<Guid>? customerIds);

    Task<Campaign?> GetByIdAsync(Guid campaignId);

    Task<(List<Campaign> Items, int TotalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        string? search);

    Task UpdateCampaignAsync(
        Guid campaignId,
        Campaign campaign,
        List<CampaignTemplate> templates,
        List<CampaignRule> rules,
        List<Guid>? customerIds);

    Task DeleteCampaignAsync(Guid campaignId);

    Task<List<(Guid CampaignId, string Name)>> GetDropdownAsync();
    Task<List<(int CampaignTypeId, string Name)>> GetCampaignTypeDropdownAsync();
}
