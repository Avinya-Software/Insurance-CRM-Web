namespace Avinya.InsuranceCRM.API.RequestModels
{
    public class CreateOrUpdateInsurerRequest
    {
        public Guid? InsurerId { get; set; } // null = create
        public string InsurerName { get; set; } = null!;
        public string ShortCode { get; set; } = null!;
        public string? ContactDetails { get; set; }
        public string? PortalUrl { get; set; }
        public string? PortalUsername { get; set; }
        public string? PortalPassword { get; set; }
    }

}
