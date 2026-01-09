using Microsoft.AspNetCore.Identity;

namespace Avinya.InsuranceCRM.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public bool IsApproved { get; set; } = false;
    public bool IsActive { get; set; } = true;

    public DateTime? ApprovedAt { get; set; }
    public string? ApprovedBy { get; set; }
}
