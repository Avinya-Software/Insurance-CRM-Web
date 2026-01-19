using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.Repository
{
    public class SystemEventRepository : ISystemEventRepository
    {
        private readonly AppDbContext _db;

        public SystemEventRepository(AppDbContext db)
        {
            _db = db;
        }

        /* ================= CREATE ================= */

        public async Task AddAsync(SystemEvent systemEvent)
        {
            await _db.SystemEvents.AddAsync(systemEvent);
        }

        /* ================= GET ================= */

        public async Task<SystemEvent?> GetByIdAsync(Guid eventId)
        {
            return await _db.SystemEvents
                .FirstOrDefaultAsync(e => e.EventId == eventId);
        }

        public async Task<List<SystemEvent>> GetByAdvisorAsync(string advisorId)
        {
            return await _db.SystemEvents
                .Where(e => e.AdvisorId == advisorId)
                .OrderByDescending(e => e.EventDate)
                .ToListAsync();
        }

        public async Task<List<SystemEvent>> GetPendingByAdvisorAsync(string advisorId)
        {
            var today = DateTime.UtcNow.Date;

            return await _db.SystemEvents
                .Where(e =>
                    e.AdvisorId == advisorId &&
                    (
                        !e.IsAcknowledged ||

                        (e.IsAcknowledged &&
                         e.AcknowledgedAt.HasValue &&
                         e.AcknowledgedAt.Value.Date == today)
                    )
                )
                .OrderBy(e => e.EventDate)
                .ToListAsync();
        }


        /* ================= UPDATE ================= */

        public Task UpdateAsync(SystemEvent systemEvent)
        {
            _db.SystemEvents.Update(systemEvent);
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}
