using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class Campaign
    {
        public Guid CampaignId { get; set; }
        public string Name { get; set; } = null!;

        public string CampaignType { get; set; } = null!;
        public int CampaignTypeId { get; set; } = 0;

        public string Channel { get; set; } = null!;

        public string AdvisorId { get; set; } = null!;
        public bool IsActive { get; set; }
        public bool ApplyToAllCustomers { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public DateTime CreatedAt { get; set; }

        [JsonIgnore]
        [ValidateNever]
        public ICollection<CampaignRule> Rules { get; set; } = new List<CampaignRule>();

        public ICollection<CampaignTemplate> Templates { get; set; } = new List<CampaignTemplate>();
        public ICollection<CampaignCustomer> CampaignCustomers { get; set; }= new List<CampaignCustomer>();

    }

}
