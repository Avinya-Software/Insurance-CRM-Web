using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class Product
    {
        [Key]
        public Guid ProductId { get; set; } = Guid.NewGuid();

        /* ================= TENANT ================= */
        public Guid? CompanyId { get; set; }
        [Required]
        public string AdvisorId { get; set; } = null!;

        /* ================= RELATIONS ================= */

        [Required]
        public Guid InsurerId { get; set; }

        [Required]
        public int ProductCategoryId { get; set; }
        public ProductCategory ProductCategory { get; set; } = null!;

        /* ================= PRODUCT DETAILS ================= */

        [Required]
        [MaxLength(150)]
        public string ProductName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string ProductCode { get; set; } = string.Empty;

        public int DefaultReminderDays { get; set; } = 0;

        // JSON / Text rules
        public string? CommissionRules { get; set; }

        public bool IsActive { get; set; } = true;

        /* ================= AUDIT ================= */

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
