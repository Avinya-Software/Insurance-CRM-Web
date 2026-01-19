namespace Avinya.InsuranceCRM.API.RequestModels
{
    public class CompanyRegisterRequest
    {
        // Company details
        public string CompanyName { get; set; } = null!;

        // Company Admin credentials
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
