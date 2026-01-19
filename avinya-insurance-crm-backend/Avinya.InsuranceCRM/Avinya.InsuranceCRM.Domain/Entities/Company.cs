using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class Company
    {
        public Guid CompanyId { get; set; }
        public string CompanyName { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
