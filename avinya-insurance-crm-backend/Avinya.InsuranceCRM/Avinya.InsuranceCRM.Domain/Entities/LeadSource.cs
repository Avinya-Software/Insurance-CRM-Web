using System.ComponentModel.DataAnnotations;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class LeadSource
    {
        [Key]
        public int LeadSourceId { get; set; }

        [Required]
        [MaxLength(50)]
        public string SourceName { get; set; } = null!; 

        [MaxLength(200)]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;
        public int DisplayOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
