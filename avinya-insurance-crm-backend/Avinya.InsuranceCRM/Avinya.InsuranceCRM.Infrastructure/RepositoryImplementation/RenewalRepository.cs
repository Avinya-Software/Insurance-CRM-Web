using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class RenewalRepository : IRenewalRepository
    {
        private readonly AppDbContext _context;

        public RenewalRepository(AppDbContext context)
        {
            _context = context;
        }

        // ---------------- UPSERT ----------------
        public async Task<Renewal> UpsertAsync(Renewal renewal, string userId)
        {
            Renewal entity;

            if (renewal.RenewalId == Guid.Empty)
            {
                entity = new Renewal
                {
                    RenewalId = Guid.NewGuid(),
                    CreatedBy = userId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Renewals.Add(entity);
            }
            else
            {
                entity = await _context.Renewals
                    .FirstOrDefaultAsync(x => x.RenewalId == renewal.RenewalId)
                    ?? throw new KeyNotFoundException("Renewal not found");
            }

            // ---------- COMMON FIELDS ----------
            entity.PolicyId = renewal.PolicyId;
            entity.CustomerId = renewal.CustomerId;
            entity.RenewalDate = renewal.RenewalDate;
            entity.RenewalPremium = renewal.RenewalPremium;
            entity.RenewalStatusId = renewal.RenewalStatusId;
            entity.ReminderDatesJson = renewal.ReminderDatesJson;

            await _context.SaveChangesAsync();
            return entity;
        }

        // ---------------- GET LIST ----------------
        public async Task<object> GetRenewalsAsync(
            int pageNumber,
            int pageSize,
            string? search,
            int? renewalStatusId)
        {
            var query = _context.Renewals
                .Include(x => x.Customer)
                .Include(x => x.Policy)
                .Include(x => x.RenewalStatus)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(x =>
                    x.Customer.FullName.Contains(search) ||
                    x.Policy.PolicyCode.Contains(search)
                );
            }

            if (renewalStatusId.HasValue)
            {
                query = query.Where(x => x.RenewalStatusId == renewalStatusId);
            }

            var totalCount = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new
                {
                    x.RenewalId,
                    x.RenewalDate,
                    x.RenewalPremium,
                    x.CustomerId,
                    x.PolicyId,
                    Status = x.RenewalStatus.StatusName,
                    CustomerName = x.Customer.FullName,
                    PolicyCode = x.Policy.PolicyCode
                })
                .ToListAsync();

            return new
            {
                totalCount,
                pageNumber,
                pageSize,
                data
            };
        }

        // ---------------- STATUS DROPDOWN ----------------
        public async Task<List<RenewalStatusMaster>> GetRenewalStatusesAsync()
        {
            return await _context.RenewalStatuses
                .Where(x => x.IsActive)
                .OrderBy(x => x.RenewalStatusId)
                .ToListAsync();
        }
    }
}
