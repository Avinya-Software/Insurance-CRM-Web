namespace Avinya.InsuranceCRM.Application.DTOs
{
    public class LeadListDto
    {
        public Guid LeadId { get; set; }
        public string LeadNo { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Mobile { get; set; }
        public string? Address { get; set; }

        public int LeadStatusId { get; set; }
        public string LeadStatusName { get; set; } = null!;

        public int LeadSourceId { get; set; }
        public string LeadSourceName { get; set; } = null!;
        public string? LeadSourceDescription { get; set; }

        public Guid? CompanyId { get; set; }
        public string AdvisorId { get; set; } = null!;

        public bool IsConverted { get; set; }
        public Guid? CustomerId { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public List<LeadFollowUpDto> FollowUps { get; set; } = new();
    }
}
