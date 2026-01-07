using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class CampaignLog
    {
        public Guid CampaignLogId { get; set; }

        public Guid CampaignId { get; set; }
        public Guid CustomerId { get; set; }

        public DateTime TriggerDate { get; set; }
        public string Channel { get; set; } = null!;

        public string Status { get; set; } = null!;
        public string? ErrorMessage { get; set; }

        public DateTime? SentAt { get; set; }
    }

}
