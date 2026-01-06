namespace Avinya.InsuranceCRM.API.RequestModels
{
    public class CreateOrUpdateLeadRequest
    {
        public Guid? LeadId { get; set; } // null = create

        public string FullName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Mobile { get; set; }
        public string? Address { get; set; }
        public int LeadStatusId { get; set; }
        public int LeadSourceId { get; set; }
        public string? LeadSourceDescription { get; set; }

        //public string AdvisorId { get; set; } = null!;
        public string? Notes { get; set; }
        public Guid? CustomerId { get; set; }

    }

}
