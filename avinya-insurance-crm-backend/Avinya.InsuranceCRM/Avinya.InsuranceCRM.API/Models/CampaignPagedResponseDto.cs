using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.API.Models
{
    public class CampaignPagedResponseDto
    {
        public Guid CampaignId { get; set; }
        public string Name { get; set; } = null!;
        public string CampaignType { get; set; } = null!;
        public int CampaignTypeId { get; set; }
        public string Channel { get; set; } = null!;
        public bool IsActive { get; set; }
        public bool ApplyToAllCustomers { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<CampaignCustomer> CampaignCustomers { get; set; } =
            new List<CampaignCustomer>();

        public ICollection<CampaignTemplate> Templates { get; set; } =
            new List<CampaignTemplate>();

        public CampaignRuleDto? Rule { get; set; }
    }

    public class CampaignRuleDto
    {
        public string RuleEntity { get; set; } = null!;
        public string RuleField { get; set; } = null!;
        public string Operator { get; set; } = null!;

        public string? Direction { get; set; }
        public int? Days { get; set; }
        public string? FixedDate { get; set; }
    }

}
