namespace Avinya.InsuranceCRM.API.ResponseModels
{
    public class AdvisorLoginResponse
    {
        public Guid AdvisorId { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
    }
}
