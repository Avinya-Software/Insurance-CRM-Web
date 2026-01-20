namespace Avinya.InsuranceCRM.Application.DTOs
{
    public class CustomerListDto
    {
        public Guid CustomerId { get; set; }

        public string FullName { get; set; } = null!;
        public string PrimaryMobile { get; set; } = null!;
        public string? SecondaryMobile { get; set; }
        public string Email { get; set; } = null!;
        public string? Address { get; set; }

        public Guid? CompanyId { get; set; }
        public string? CompanyName { get; set; }

        public DateTime? DOB { get; set; }
        public DateTime? Anniversary { get; set; }

        public string? KYCStatus { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<CustomerCampaignDto> Campaigns { get; set; } = new();
    }
}
