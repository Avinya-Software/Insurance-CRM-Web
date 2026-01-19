namespace Avinya.InsuranceCRM.Application.ResponseModels
{
    public class LeadFollowUpResponse
    {
        public Guid FollowUpId { get; set; }
        public DateTime FollowUpDate { get; set; }
        public DateTime? NextFollowUpDate { get; set; }
        public string? Remark { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid CreatedBy { get; set; }
    }
}
