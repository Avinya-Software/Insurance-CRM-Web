using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class Customer
    {
        [Key]
        public Guid CustomerId { get; set; }

        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = null!;

        [Required]
        [MaxLength(15)]
        public string PrimaryMobile { get; set; } = null!;

        [MaxLength(15)]
        public string? SecondaryMobile { get; set; }

        [Required]
        [MaxLength(200)]
        public string Email { get; set; } = null!;

        [MaxLength(500)]
        public string? Address { get; set; }
        public Guid? LeadId { get; set; }
        public Guid? CompanyId { get; set; }
        [Required]
        public string AdvisorId { get; set; } = null!;
        public DateTime? DOB { get; set; }
        public DateTime? Anniversary { get; set; }

        [MaxLength(50)]
        public string? KYCStatus { get; set; }

        public string? KYCFiles { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public ICollection<CampaignCustomer> CampaignCustomers { get; set; } = new List<CampaignCustomer>();
    }
}
