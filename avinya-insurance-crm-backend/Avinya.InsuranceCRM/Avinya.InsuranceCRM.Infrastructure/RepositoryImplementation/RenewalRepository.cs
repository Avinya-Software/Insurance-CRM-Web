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

        /* ================= UPSERT ================= */

        public async Task<Renewal> UpsertAsync(
            Renewal renewal,
            string advisorId)
        {
            Renewal entity;

            /* ---------- CREATE ---------- */
            if (renewal.RenewalId == Guid.Empty)
            {
                entity = new Renewal
                {
                    RenewalId = Guid.NewGuid(),
                    AdvisorId = advisorId,
                    CreatedBy = advisorId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Renewals.Add(entity);
            }
            /* ---------- UPDATE ---------- */
            else
            {
                entity = await _context.Renewals
                    .FirstOrDefaultAsync(x =>
                        x.RenewalId == renewal.RenewalId &&
                        x.AdvisorId == advisorId
                    ) ?? throw new KeyNotFoundException("Renewal not found");

                entity.UpdatedAt = DateTime.UtcNow;
            }

            /* ---------- COMMON FIELDS ---------- */
            entity.PolicyId = renewal.PolicyId;
            entity.CustomerId = renewal.CustomerId;
            entity.RenewalDate = renewal.RenewalDate;
            entity.RenewalPremium = renewal.RenewalPremium;
            entity.RenewalStatusId = renewal.RenewalStatusId;
            entity.ReminderDatesJson = renewal.ReminderDatesJson;

            await _context.SaveChangesAsync();
            return entity;
        }

        /* ================= GET LIST ================= */

        public async Task<object> GetRenewalsAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            string? search,
            int? renewalStatusId)
        {
            var query = _context.Renewals
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Policy)
                .Include(x => x.RenewalStatus)
                .Where(x => x.AdvisorId == advisorId);

            /* ---------- SEARCH ---------- */
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(x =>
                    x.Customer.FullName.Contains(search) ||
                    x.Policy.PolicyCode.Contains(search)
                );
            }

            /* ---------- FILTER ---------- */
            if (renewalStatusId.HasValue)
            {
                query = query.Where(x =>
                    x.RenewalStatusId == renewalStatusId.Value);
            }

            var totalRecords = await query.CountAsync();

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
                    PolicyCode = x.Policy.PolicyCode,

                    x.CreatedAt
                })
                .ToListAsync();

            return new
            {
                totalRecords,
                pageNumber,
                pageSize,
                totalPages = (int)Math.Ceiling(
                    totalRecords / (double)pageSize
                ),
                data
            };
        }

        /* ================= GET BY ID ================= */

        public async Task<Renewal?> GetByIdAsync(
            Guid renewalId,
            string advisorId)
        {
            return await _context.Renewals
                .Include(x => x.Customer)
                .Include(x => x.Policy)
                .Include(x => x.RenewalStatus)
                .FirstOrDefaultAsync(x =>
                    x.RenewalId == renewalId &&
                    x.AdvisorId == advisorId
                );
        }

        /* ================= DELETE ================= */

        public async Task DeleteByIdAsync(
            Guid renewalId,
            string advisorId)
        {
            var renewal = await _context.Renewals
                .FirstOrDefaultAsync(x =>
                    x.RenewalId == renewalId &&
                    x.AdvisorId == advisorId
                );

            if (renewal == null)
                return;

            _context.Renewals.Remove(renewal);
            await _context.SaveChangesAsync();
        }

        /* ================= STATUS DROPDOWN ================= */

        public async Task<List<RenewalStatusMaster>> GetRenewalStatusesAsync()
        {
            return await _context.RenewalStatuses
                .Where(x => x.IsActive)
                .OrderBy(x => x.RenewalStatusId)
                .ToListAsync();
        }
        public async Task<bool> UpdateRenewalStatusAsync(
    string advisorId,
    Guid renewalId,
    int renewalStatusId)
        {
            var renewal = await _context.Renewals
                .FirstOrDefaultAsync(x =>
                    x.RenewalId == renewalId &&
                    x.AdvisorId == advisorId);

            if (renewal == null)
                return false;

            renewal.RenewalStatusId = renewalStatusId;
            renewal.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

    }
}
