using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface ISystemEventRepository
    {
        // CREATE
        Task AddAsync(SystemEvent systemEvent);

        // GET
        Task<SystemEvent?> GetByIdAsync(Guid eventId);
        Task<List<SystemEvent>> GetByAdvisorAsync(string advisorId);
        Task<List<SystemEvent>> GetPendingByAdvisorAsync(string advisorId);

        // UPDATE
        Task UpdateAsync(SystemEvent systemEvent);

        Task SaveChangesAsync();
    }
}
