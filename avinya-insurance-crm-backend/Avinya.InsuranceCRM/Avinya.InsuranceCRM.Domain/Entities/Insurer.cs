using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class Insurer
    {
        public Guid InsurerId { get; set; }

        public string InsurerName { get; set; } = null!;
        public string ShortCode { get; set; } = null!;

        // Textarea → nvarchar(max)
        public string? ContactDetails { get; set; }

        public string? PortalUrl { get; set; }
        public string? PortalUsername { get; set; }

        // 🔐 Encrypted in DB
        public string? PortalPassword { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

}
