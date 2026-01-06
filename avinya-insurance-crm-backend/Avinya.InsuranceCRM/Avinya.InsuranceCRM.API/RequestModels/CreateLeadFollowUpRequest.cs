namespace Avinya.InsuranceCRM.API.RequestModels
{
    public class CreateLeadFollowUpRequest
    {
        public Guid LeadId { get; set; }
        public DateTime FollowUpDate { get; set; }
        public DateTime? NextFollowUpDate { get; set; }
        public string? Remark { get; set; }
    }
}
