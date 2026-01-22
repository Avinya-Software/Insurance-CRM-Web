using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Application.DTOs.CustomerPolicy
{
    public class PolicyUpsertResponseDto
    {
        public Guid? PolicyId { get; set; }

        public Guid CustomerId { get; set; }

        public Guid InsurerId { get; set; }

        public Guid ProductId { get; set; }

        public int PolicyStatusId { get; set; }

        public int PolicyTypeId { get; set; }

        public string? RegistrationNo { get; set; }
        public string? PolicyNumber { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public decimal PremiumNet { get; set; }
        public decimal PremiumGross { get; set; }

        public string? PaymentMode { get; set; }
        public DateTime? PaymentDueDate { get; set; }
        public DateTime? RenewalDate { get; set; }

        public string? BrokerCode { get; set; }
        public string? PolicyCode { get; set; }
        public bool PaymentDone { get; set; } = false;
        public string? PolicyDocuments { get; set; }
    }
}
