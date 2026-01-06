using System;
using System.ComponentModel.DataAnnotations;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class PolicyTypeMaster
    {
        [Key]
        public int PolicyTypeId { get; set; }

        [Required]
        [MaxLength(30)]
        public string TypeName { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
