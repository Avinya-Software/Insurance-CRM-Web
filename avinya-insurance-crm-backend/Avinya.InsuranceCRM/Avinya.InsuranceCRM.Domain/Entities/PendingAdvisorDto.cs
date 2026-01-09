namespace Avinya.InsuranceCRM.Application.DTOs.Admin;

public class PendingAdvisorDto
{
    public string UserId { get; set; } = null!;

    public Guid AdvisorId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public DateTime RegisteredAt { get; set; }
}
