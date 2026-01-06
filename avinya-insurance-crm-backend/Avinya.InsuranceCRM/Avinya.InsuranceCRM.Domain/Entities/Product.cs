using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class Product
    {
        [Key]
        public Guid ProductId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid InsurerId { get; set; }

        [Required]
        public int ProductCategoryId { get; set; }
        public ProductCategory ProductCategory { get; set; } = null!;

        [ForeignKey(nameof(ProductCategoryId))]
        [Required]
        [MaxLength(150)]
        public string ProductName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string ProductCode { get; set; } = string.Empty;

        public int DefaultReminderDays { get; set; } = 0;

        public string? CommissionRules { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
