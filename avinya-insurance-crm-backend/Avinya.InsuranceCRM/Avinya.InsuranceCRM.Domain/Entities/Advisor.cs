namespace Avinya.InsuranceCRM.Domain.Entities;

public class Advisor
{
    public Guid AdvisorId { get; set; }
    public string UserId { get; set; } = null!; // FK → AspNetUsers
    public Guid? CompanyId { get; set; }
    public string FullName { get; set; } = null!;
    public string MobileNumber { get; set; } = null!;
    public bool IsActive { get; set; } = true;
    public string Email { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
