using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using Avinya.InsuranceCRM.Domain.ValueObjects;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class Renewal
    {
        public Guid RenewalId { get; set; }

        /* ================= TENANCY ================= */

        // 🔐 Enforces advisor-level isolation
        public string AdvisorId { get; set; } = null!;

        /* ================= FOREIGN KEYS ================= */

        public Guid PolicyId { get; set; }

        [ValidateNever]
        public CustomerPolicy Policy { get; set; } = null!;

        public Guid CustomerId { get; set; }

        [ValidateNever]
        public Customer Customer { get; set; } = null!;

        /* ================= REMINDERS ================= */

        /// <summary>
        /// Stores reminder days like [90,60,30,15,7,1]
        /// </summary>
        public string ReminderDatesJson { get; set; } = null!;

        /// <summary>
        /// Stores reminder logs as JSON
        /// </summary>
        public string? ReminderLog { get; private set; }

        /* ================= STATUS ================= */

        public int RenewalStatusId { get; set; }

        [ValidateNever]
        public RenewalStatusMaster RenewalStatus { get; set; } = null!;

        /* ================= RENEWAL DETAILS ================= */

        public DateTime RenewalDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal RenewalPremium { get; set; }

        /* ================= AUDIT ================= */

        [ValidateNever]
        public string CreatedBy { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        /* ================= DOMAIN METHODS ================= */

        public List<ReminderLogItem> GetReminderLogs()
        {
            if (string.IsNullOrWhiteSpace(ReminderLog))
                return new List<ReminderLogItem>();

            return JsonSerializer.Deserialize<List<ReminderLogItem>>(ReminderLog)
                   ?? new List<ReminderLogItem>();
        }

        public bool HasReminderBeenSent(int daysBefore)
        {
            return GetReminderLogs()
                .Any(x => x.DaysBefore == daysBefore);
        }

        public void AddReminderLog(int daysBefore, string channel = "Email")
        {
            var logs = GetReminderLogs();

            if (logs.Any(x => x.DaysBefore == daysBefore))
                return; // prevent duplicates

            logs.Add(new ReminderLogItem
            {
                DaysBefore = daysBefore,
                SentOn = DateTime.UtcNow,
                Channel = channel
            });

            ReminderLog = JsonSerializer.Serialize(logs);
        }
    }
}
