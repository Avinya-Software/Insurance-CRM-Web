namespace Avinya.InsuranceCRM.Application.DTOs.CustomerPolicy
{
    public class CreatePolicyRequest
    {
        public Guid? PolicyId { get; set; } // NULL = CREATE, NOT NULL = UPDATE

        public Guid CustomerId { get; set; }

        public Guid? InsurerId { get; set; }
        public Guid? ProductId { get; set; }

        public int? PolicyStatusId { get; set; }
        public int? PolicyTypeId { get; set; }

        public string? RegistrationNo { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public decimal? PremiumNet { get; set; }
        public decimal? PremiumGross { get; set; }

        public string? PaymentMode { get; set; }
        public DateTime? PaymentDueDate { get; set; }
        public DateTime? RenewalDate { get; set; }

        public string? BrokerCode { get; set; }
        public string? PolicyCode { get; set; }

        public bool? PaymentDone { get; set; }

        public string? PolicyDocumentRef { get; set; }
    }
}
