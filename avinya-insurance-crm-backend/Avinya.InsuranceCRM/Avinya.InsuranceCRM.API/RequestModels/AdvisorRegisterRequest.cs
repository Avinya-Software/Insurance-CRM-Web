namespace Avinya.InsuranceCRM.API.RequestModels
{
    public class AdvisorRegisterRequest
    {
        public string FullName { get; set; } = null!;
        public string MobileNumber { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
