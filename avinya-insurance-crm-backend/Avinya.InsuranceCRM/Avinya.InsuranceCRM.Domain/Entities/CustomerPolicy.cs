using Avinya.InsuranceCRM.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

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
    public class PaymentReminderLogItem
    {
        public string Type { get; set; } = null!; // "T-1", "T"
        public DateTime SentOn { get; set; }
    }
    public string? PaymentReminderLog { get; private set; }

    public bool HasPaymentReminderBeenSent(string type)
    {
        if (string.IsNullOrWhiteSpace(PaymentReminderLog))
            return false;

        var logs = JsonSerializer.Deserialize<List<PaymentReminderLogItem>>(
            PaymentReminderLog);

        return logs?.Any(x => x.Type == type) == true;
    }

    public void AddPaymentReminderLog(string type)
    {
        var logs = string.IsNullOrWhiteSpace(PaymentReminderLog)
            ? new List<PaymentReminderLogItem>()
            : JsonSerializer.Deserialize<List<PaymentReminderLogItem>>(
                PaymentReminderLog) ?? new List<PaymentReminderLogItem>();

        if (logs.Any(x => x.Type == type))
            return;

        logs.Add(new PaymentReminderLogItem
        {
            Type = type,
            SentOn = DateTime.UtcNow
        });

        PaymentReminderLog = JsonSerializer.Serialize(logs);
    }
}

