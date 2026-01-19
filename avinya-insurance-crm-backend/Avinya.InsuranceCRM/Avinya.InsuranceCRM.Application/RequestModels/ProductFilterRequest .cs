namespace Avinya.InsuranceCRM.Application.RequestModels
{
    public class ProductFilterRequest : PaginationRequest
    {
        public int? ProductCategoryId { get; set; }
        public string? ProductName { get; set; }
        public string? ProductCode { get; set; }
        public Guid? InsurerId { get; set; }
    }
}
