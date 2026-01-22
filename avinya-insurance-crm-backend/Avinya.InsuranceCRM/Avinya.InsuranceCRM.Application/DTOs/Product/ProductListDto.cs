namespace Avinya.InsuranceCRM.Application.DTOs.Product
{
    public class ProductListDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductCode { get; set; } = string.Empty;
        public int DefaultReminderDays { get; set; }
        public Guid InsurerId { get; set; }
        public int ProductCategoryId { get; set; }
        public string ProductCategoryName { get; set; } = string.Empty;

        public string? CommissionRules { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
