using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class Campaign
    {
        public Guid CampaignId { get; set; }
        public string Name { get; set; } = null!;

        public string CampaignType { get; set; } = null!;
        public string Channel { get; set; } = null!;

        public string AdvisorId { get; set; } = null!;
        public bool IsActive { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<CampaignRule> Rules { get; set; } = new List<CampaignRule>();
        public ICollection<CampaignTemplate> Templates { get; set; } = new List<CampaignTemplate>();
    }

}
