using System;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class InsuranceClaim
    {
        public Guid ClaimId { get; set; }

        /* ================= TENANT ================= */

        // 🔐 MULTI-TENANT SAFETY
        public Guid? CompanyId { get; set; }
        public string AdvisorId { get; set; } = null!;

        /* ================= RELATIONS ================= */

        public Guid PolicyId { get; set; }
        public Guid CustomerId { get; set; }

        // 🔑 MASTER TABLE FKs
        public int ClaimTypeId { get; set; }
        public int ClaimStageId { get; set; }
        public int ClaimHandlerId { get; set; }

        /* ================= CLAIM DETAILS ================= */

        public DateTime IncidentDate { get; set; }

        public decimal ClaimAmount { get; set; }
        public decimal? ApprovedAmount { get; set; }

        // Comma-separated file refs (same pattern as Policy)
        public string? Documents { get; set; }

        public string Status { get; set; } = null!;
        public int TATDays { get; set; }

        public string? Notes { get; set; }

        /* ================= AUDIT ================= */

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        /* ================= NAVIGATION ================= */

        public Customer Customer { get; set; } = null!;
        public CustomerPolicy Policy { get; set; } = null!;

        public ClaimTypeMaster ClaimType { get; set; } = null!;
        public ClaimStageMaster ClaimStage { get; set; } = null!;
        public ClaimHandlerMaster ClaimHandler { get; set; } = null!;
    }
}
