namespace Avinya.InsuranceCRM.Application.DTOs
{
    public class InsurerListDto
    {
        public Guid InsurerId { get; set; }
        public string InsurerName { get; set; }
        public string ShortCode { get; set; }
        public string? ContactDetails { get; set; }
        public string? PortalUrl { get; set; }
        public string? PortalUsername { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
