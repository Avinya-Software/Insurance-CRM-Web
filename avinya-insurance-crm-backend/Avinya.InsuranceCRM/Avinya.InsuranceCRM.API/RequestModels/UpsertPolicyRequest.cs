using System;
using System.ComponentModel.DataAnnotations;

public class UpsertPolicyRequest
{
    public Guid? PolicyId { get; set; } // NULL = ADD, NOT NULL = UPDATE

    [Required]
    public Guid CustomerId { get; set; }

    [Required]
    public Guid InsurerId { get; set; }

    [Required]
    public Guid ProductId { get; set; }

    [Required]
    public int PolicyStatusId { get; set; }

    [Required]
    public int PolicyTypeId { get; set; }

    public string? RegistrationNo { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public decimal PremiumNet { get; set; }
    public decimal PremiumGross { get; set; }

    public string? PaymentMode { get; set; }
    public DateTime? PaymentDueDate { get; set; }
    public DateTime? RenewalDate { get; set; }

    public string? PolicyDocumentRef { get; set; }
    public string? BrokerCode { get; set; }
    public string? PolicyCode { get; set; }
    public List<IFormFile>? PolicyDocuments { get; set; }

}
