namespace Avinya.InsuranceCRM.Application.DTOs.Auth
{
    public class AdvisorProfileDto
    {
        public Guid AdvisorId { get; set; }
        public string FullName { get; set; } = null!;
        public string MobileNumber { get; set; } = null!;
    }
}
