using System.ComponentModel.DataAnnotations;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class SystemEvent
    {
        [Key] 
        public Guid EventId { get; set; } = Guid.NewGuid();

        public string EventType { get; set; } = null!;

        public Guid? LeadId { get; set; }
        public Guid? PolicyId { get; set; }
        public Guid? CustomerId { get; set; }
        public Guid? CompanyId { get; set; }
        public string AdvisorId { get; set; } = null!;

        public DateTime EventDate { get; set; }

        public string Title { get; set; } = null!;
        public string? Description { get; set; }

        public bool IsAcknowledged { get; set; } = false;
        public DateTime? AcknowledgedAt { get; set; }

        public int RetryCount { get; set; } = 0;
        public DateTime? LastTriedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
