using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class PendingCompanyDto
    {
        public Guid CompanyId { get; set; }
        public string CompanyName { get; set; } = null!;
        public string AdminUserId { get; set; } = null!;
        public string AdminEmail { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
