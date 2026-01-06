using System;
using System.ComponentModel.DataAnnotations;

public class RenewalUpsertRequest
{
    [Required]
    public Guid PolicyId { get; set; }

    [Required]
    public Guid CustomerId { get; set; }

    [Required]
    public int RenewalStatusId { get; set; }

    [Required]
    public DateTime RenewalDate { get; set; }

    public decimal RenewalPremium { get; set; }

    [Required]
    public string ReminderDatesJson { get; set; } = null!;
}
