using Avinya.InsuranceCRM.Application.DTOs;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

public class UpsertPolicyRequest
{
    public Guid? PolicyId { get; set; }

    public Guid CustomerId { get; set; }

    public Guid InsurerId { get; set; }

    public Guid ProductId { get; set; }

    public int PolicyStatusId { get; set; }

    public int PolicyTypeId { get; set; }

    public string? RegistrationNo { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public decimal PremiumNet { get; set; }
    public decimal PremiumGross { get; set; }

    public string? PaymentMode { get; set; }
    public DateTime? PaymentDueDate { get; set; }
    public DateTime? RenewalDate { get; set; }

    public string? BrokerCode { get; set; }
    public string? PolicyCode { get; set; }
    public bool PaymentDone { get; set; } = false;
    public List<string>? PolicyDocuments { get; set; }

}
