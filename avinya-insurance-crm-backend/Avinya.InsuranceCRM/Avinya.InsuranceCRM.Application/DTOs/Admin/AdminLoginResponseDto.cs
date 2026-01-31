namespace Avinya.InsuranceCRM.Application.DTOs.Admin
{
    public class AdminLoginResponseDto
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
