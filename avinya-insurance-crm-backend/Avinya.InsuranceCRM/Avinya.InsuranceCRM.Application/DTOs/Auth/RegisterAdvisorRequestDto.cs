namespace Avinya.InsuranceCRM.Application.DTOs.Auth
{
    public class RegisterAdvisorRequestDto
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string MobileNumber { get; set; } = null!;
    }
}
