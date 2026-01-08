using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class CampaignCustomer
    {
        public Guid CampaignCustomerId { get; set; }

        public Guid CampaignId { get; set; }

        [JsonIgnore]
        [ValidateNever]
        public Campaign Campaign { get; set; } = null!;

        public Guid CustomerId { get; set; }

        [JsonIgnore]
        public Customer Customer { get; set; } = null!;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}
