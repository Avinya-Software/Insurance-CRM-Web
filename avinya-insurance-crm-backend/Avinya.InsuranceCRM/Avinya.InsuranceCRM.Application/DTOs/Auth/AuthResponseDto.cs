namespace Avinya.InsuranceCRM.Application.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string UserId { get; set; } = null!;
        public string Email { get; set; } = null!;
        public Guid? CompanyId { get; set; }
        public string Role { get; set; } = null!;
        public bool IsApproved { get; set; }
        public AdvisorProfileDto? AdvisorProfile { get; set; }
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
    }
}
