using Avinya.InsuranceCRM.Domain.Entities;

public class Lead
{
    public Guid LeadId { get; set; }

    public string LeadNo { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string? Email { get; set; }
    public string? Mobile { get; set; }
    public string? Address { get; set; }

    // 🔗 Lead Status
    public int LeadStatusId { get; set; }
    public LeadStatus LeadStatus { get; set; } = null!;

    // 🔗 Lead Source
    public int LeadSourceId { get; set; }
    public LeadSource LeadSource { get; set; } = null!;

    public string? LeadSourceDescription { get; set; }

    public string AdvisorId { get; set; } = null!;

    public bool IsConverted { get; set; }
    public Guid? CustomerId { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public ICollection<LeadFollowUp> FollowUps { get; set; }
      = new List<LeadFollowUp>();
}
