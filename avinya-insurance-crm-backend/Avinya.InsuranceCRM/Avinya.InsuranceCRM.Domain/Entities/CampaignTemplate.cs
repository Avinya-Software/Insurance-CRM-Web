using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class CampaignTemplate
    {
        public Guid TemplateId { get; set; }

        public Guid CampaignId { get; set; }
        public Campaign Campaign { get; set; } = null!;

        public string? Subject { get; set; }
        public string Body { get; set; } = null!;
        public string Channel { get; set; } = null!;
    }

}
