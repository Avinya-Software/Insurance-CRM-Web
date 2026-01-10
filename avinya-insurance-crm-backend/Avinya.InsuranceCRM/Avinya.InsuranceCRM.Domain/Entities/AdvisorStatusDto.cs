using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class AdvisorStatusDto
    {
        public string UserId { get; set; } = null!;
        public Guid AdvisorId { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime? ActionDate { get; set; }
        public string Status { get; set; } = null!;
    }
}
