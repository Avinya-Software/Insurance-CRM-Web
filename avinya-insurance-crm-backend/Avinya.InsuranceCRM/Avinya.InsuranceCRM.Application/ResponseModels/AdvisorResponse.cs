namespace Avinya.InsuranceCRM.Application.ResponseModels
{
    public class AdvisorResponse
    {
        public Guid AdvisorId { get; set; }
        public string FullName { get; set; } = null!;
        public string MobileNumber { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
