namespace Avinya.InsuranceCRM.Application.RequestModels
{
    public class UpsertProductRequest
    {
        public Guid? ProductId { get; set; } // NULL = ADD

        public Guid InsurerId { get; set; }
        public int ProductCategoryId { get; set; }

        public string ProductName { get; set; } = string.Empty;
        public string ProductCode { get; set; } = string.Empty;

        public int DefaultReminderDays { get; set; }
        public string? CommissionRules { get; set; }

        public bool IsActive { get; set; } = true;
    }

}
