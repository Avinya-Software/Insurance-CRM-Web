using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class CampaignRule
    {
        public Guid CampaignRuleId { get; set; }

        public Guid CampaignId { get; set; }
        public Campaign Campaign { get; set; } = null!;

        public string RuleEntity { get; set; } = null!;
        public string RuleField { get; set; } = null!;
        public string Operator { get; set; } = null!;
        public string RuleValue { get; set; } = null!;
    }

}
