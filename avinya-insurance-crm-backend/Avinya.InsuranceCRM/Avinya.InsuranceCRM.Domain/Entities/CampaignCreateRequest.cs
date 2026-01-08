using Avinya.InsuranceCRM.Domain.Entities;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

public class CampaignCreateRequest
{
    [ValidateNever]
    public Campaign Campaign { get; set; } = null!;
    [ValidateNever]
    public List<CampaignTemplate> Templates { get; set; } = new();
    [ValidateNever]
    public List<CampaignRule> Rules { get; set; } = new();
    public List<Guid>? CustomerIds { get; set; }
}
