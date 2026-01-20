namespace Avinya.InsuranceCRM.Application.DTOs
{
    public class CustomerCampaignDto
    {
        public Guid CampaignCustomerId { get; set; }
        public Guid CampaignId { get; set; }

        public string Name { get; set; } = null!;
        public string CampaignType { get; set; } = null!;

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
