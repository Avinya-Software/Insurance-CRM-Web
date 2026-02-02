namespace Avinya.InsuranceCRM.Application.DTOs.Auth
{
    public class LoginRequestDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
