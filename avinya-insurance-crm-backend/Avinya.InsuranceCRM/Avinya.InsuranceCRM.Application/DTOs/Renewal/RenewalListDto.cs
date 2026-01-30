namespace Avinya.InsuranceCRM.Application.DTOs.Renewal
{
    public class RenewalListDto
    {
        public Guid RenewalId { get; set; }
        public DateTime RenewalDate { get; set; }
        public decimal RenewalPremium { get; set; }

        public Guid CustomerId { get; set; }
        public Guid PolicyId { get; set; }

        public string CustomerName { get; set; } = string.Empty;
        public string PolicyCode { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}
