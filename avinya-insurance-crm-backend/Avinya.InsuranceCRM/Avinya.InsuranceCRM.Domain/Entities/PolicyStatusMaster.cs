using System;
using System.ComponentModel.DataAnnotations;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class PolicyStatusMaster
    {
        [Key]
        public int PolicyStatusId { get; set; }

        [Required]
        [MaxLength(30)]
        public string StatusName { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
