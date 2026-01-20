namespace Avinya.InsuranceCRM.Application.DTOs.LeadFollowUp
{
    public class LeadFollowupDTO
    {
        public Guid FollowUpID { get; set; }
        public Guid LeadID { get; set; }
        public string LeadNo { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? Remark { get; set; }
        public DateTime? NextFollowupDate { get; set; }
        public int Status { get; set; }

        public string StatusName { get; set; }
        public Guid? FollowUpBy { get; set; }
        public string? FollowUpByName { get; set; }  
        public DateTime? CreatedDate { get; set; }
    }
}
