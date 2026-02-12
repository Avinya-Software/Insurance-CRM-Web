using Microsoft.AspNetCore.Http;

namespace Avinya.InsuranceCRM.Application.RequestModels
{
    public class CreateCustomerRequest
    {
        public Guid? CustomerId { get; set; }
        public string FullName { get; set; } = null!;
        public string PrimaryMobile { get; set; } = null!;
        public string? SecondaryMobile { get; set; }
        public string Email { get; set; } = null!;
        public string? Address { get; set; }
        public string? KYCStatus { get; set; }
        public Guid? LeadId { get; set; }
        public DateTime? DOB { get; set; }
        public DateTime? Anniversary { get; set; }
        public string? Notes { get; set; }
        public string? AdvisorId { get; set; }
        public List<IFormFile>? KYCFiles { get; set; }
    }
}
