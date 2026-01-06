using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class LeadFollowUp
    {
        public Guid FollowUpId { get; set; }

        // ✅ Foreign Key
        public Guid LeadId { get; set; }

        public DateTime FollowUpDate { get; set; }
        public DateTime? NextFollowUpDate { get; set; }

        public string? Remark { get; set; }

        public Guid CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }

        // ✅ Navigation
        public Lead Lead { get; set; } = null!;
    }
}
