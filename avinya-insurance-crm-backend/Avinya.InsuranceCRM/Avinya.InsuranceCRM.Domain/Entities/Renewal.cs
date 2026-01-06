using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class Renewal
    {
        public Guid RenewalId { get; set; }

        // ---------------- FKs ----------------
        public Guid PolicyId { get; set; }

        [ValidateNever]
        public CustomerPolicy Policy { get; set; } = null!;

        public Guid CustomerId { get; set; }
        [ValidateNever]
        public Customer Customer { get; set; } = null!;

        // ---------------- REMINDERS ----------------
        /// <summary>
        /// Stores reminder days like [90,60,30,15,7,1]
        /// </summary>
        public string ReminderDatesJson { get; set; } = null!;

        /// <summary>
        /// Stores reminder logs:
        /// [{ channel, timestamp, status }]
        /// </summary>
        public string? ReminderLog { get; set; }

        // ---------------- STATUS ----------------
        public int RenewalStatusId { get; set; }
        [ValidateNever]
        public RenewalStatusMaster RenewalStatus { get; set; } = null!;

        // ---------------- RENEWAL DETAILS ----------------
        public DateTime RenewalDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal RenewalPremium { get; set; }

        // ---------------- AUDIT ----------------
        [ValidateNever]
        public string CreatedBy { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
