using Avinya.InsuranceCRM.Domain.Entities;
using System.ComponentModel.DataAnnotations;

public class CustomerPolicy
{
    [Key]
    public Guid PolicyId { get; set; } = Guid.NewGuid();

    // ---------------- FOREIGN KEYS ----------------
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    public Guid InsurerId { get; set; }
    public Insurer Insurer { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string AdvisorId { get; set; } = null!; // AspNetUsers

    // ---------------- POLICY MASTER FKs ----------------
    public int PolicyStatusId { get; set; }
    public PolicyStatusMaster PolicyStatus { get; set; } = null!;

    public int PolicyTypeId { get; set; }
    public PolicyTypeMaster PolicyType { get; set; } = null!;

    // ---------------- DETAILS ----------------
    [Required, MaxLength(50)]
    public string PolicyNumber { get; set; } = string.Empty;

    [MaxLength(30)]
    public string? RegistrationNo { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    // ---------------- FINANCIAL ----------------
    public decimal PremiumNet { get; set; }
    public decimal PremiumGross { get; set; }
    public string? PaymentMode { get; set; }
    public bool PaymentDone { get; set; } = false;
    public DateTime? PaymentDueDate { get; set; }
    public DateTime? RenewalDate { get; set; }

    // ---------------- EXTRA ----------------
    public string? PolicyDocumentRef { get; set; }
    public string? BrokerCode { get; set; }
    public string? PolicyCode { get; set; }

    // ---------------- AUDIT ----------------
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

}
