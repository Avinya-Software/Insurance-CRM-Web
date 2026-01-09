using Avinya.InsuranceCRM.Domain.Entities;
using System.Text.Json.Serialization;

public class CampaignRule
{
    public Guid CampaignRuleId { get; set; }

    public Guid CampaignId { get; set; }
    [JsonIgnore]
    public Campaign Campaign { get; set; } = null!;

    public string RuleEntity { get; set; } = null!;

    public string RuleField { get; set; } = null!;

    public string Operator { get; set; } = null!;

    public string RuleValue { get; set; } = null!;

    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
