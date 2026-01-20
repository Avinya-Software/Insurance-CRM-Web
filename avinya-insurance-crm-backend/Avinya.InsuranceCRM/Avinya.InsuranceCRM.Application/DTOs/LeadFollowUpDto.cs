

namespace Avinya.InsuranceCRM.Application.DTOs
{
    public class LeadFollowUpDto
    {
        public Guid FollowUpId { get; set; }
        public DateTime? NextFollowUpDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
