using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class LeadStatus
    {
        [Key]
        public int LeadStatusId { get; set; } 
        [Required]
        [MaxLength(50)]
        public string StatusName { get; set; } = null!;  
        [MaxLength(200)]
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
