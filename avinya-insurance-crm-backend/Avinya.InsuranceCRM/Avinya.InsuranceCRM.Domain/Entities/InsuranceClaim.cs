namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class InsuranceClaim
    {
        public Guid ClaimId { get; set; }

        public Guid PolicyId { get; set; }
        public Guid CustomerId { get; set; }

        // 🔑 FK INSTEAD OF STRING
        public int ClaimTypeId { get; set; }
        public int ClaimStageId { get; set; }
        public int ClaimHandlerId { get; set; }

        public DateTime IncidentDate { get; set; }

        public decimal ClaimAmount { get; set; }
        public decimal? ApprovedAmount { get; set; }

        public string? Documents { get; set; }

        public string Status { get; set; }
        public int TATDays { get; set; }
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // 🔗 NAVIGATION
        public Customer Customer { get; set; }
        public CustomerPolicy Policy { get; set; }
        public ClaimTypeMaster ClaimType { get; set; }
        public ClaimStageMaster ClaimStage { get; set; }
        public ClaimHandlerMaster ClaimHandler { get; set; }
    }
}
