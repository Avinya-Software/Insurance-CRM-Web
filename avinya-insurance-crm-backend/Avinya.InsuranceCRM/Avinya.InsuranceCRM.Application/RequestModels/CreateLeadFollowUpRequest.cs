namespace Avinya.InsuranceCRM.Application.RequestModels
{
    public class CreateLeadFollowUpRequest
    {
        public Guid? FollowUpId { get; set; }   
        public Guid LeadId { get; set; }
        public DateTime NextFollowUpDate { get; set; }
        public string? Remark { get; set; }
        public int Status { get; set; }
    }
}
