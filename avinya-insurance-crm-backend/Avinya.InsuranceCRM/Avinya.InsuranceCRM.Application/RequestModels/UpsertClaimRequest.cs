using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace Avinya.InsuranceCRM.Application.RequestModels
{
    public class UpsertClaimRequest
    {
        public Guid? ClaimId { get; set; }

        public Guid PolicyId { get; set; }
        public Guid CustomerId { get; set; }

        // ✅ MASTER TABLE IDS (REPLACED STRINGS)
        public int ClaimTypeId { get; set; }
        public int ClaimStageId { get; set; }
        public int ClaimHandlerId { get; set; }

        public DateTime IncidentDate { get; set; }

        public decimal ClaimAmount { get; set; }
        public decimal? ApprovedAmount { get; set; }

        public int TATDays { get; set; }

        // Status like Open / Approved / Rejected / Closed
        public string? Status { get; set; }

        public string? Notes { get; set; }

        // ✅ FILES (multipart/form-data)
        public List<IFormFile>? Documents { get; set; }
    }
}
