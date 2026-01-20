namespace Avinya.InsuranceCRM.Application.DTOs.LeadFollowUp
{
    public class LeadFollowUpResponseDto
    {
        public Guid FollowUpID { get; set; }
        public Guid LeadID { get; set; }
        public string? Notes { get; set; }
        public DateTime NextFollowupDate { get; set; }
        public int Status { get; set; }
        public Guid FollowUpBy { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
