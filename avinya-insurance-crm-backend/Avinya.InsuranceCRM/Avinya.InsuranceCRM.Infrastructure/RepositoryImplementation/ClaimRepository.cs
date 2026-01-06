using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class ClaimRepository : IClaimRepository
    {
        private readonly AppDbContext _context;

        public ClaimRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<InsuranceClaim?> GetByIdAsync(Guid claimId)
        {
            return await _context.Claims
                .FirstOrDefaultAsync(x => x.ClaimId == claimId);
        }

        public async Task AddAsync(InsuranceClaim claim)
        {
            await _context.Claims.AddAsync(claim);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(InsuranceClaim claim)
        {
            _context.Claims.Update(claim);
            await _context.SaveChangesAsync();
        }
        public async Task<(int TotalRecords, List<InsuranceClaim> Data)> GetPagedAsync(
           int pageNumber,
           int pageSize,
           string? search,
           Guid? customerId,
           Guid? policyId,
           int? claimTypeId,
           int? claimStageId,
           int? claimHandlerId,
           string? status)
        {
            var query = _context.Claims
            .Include(x => x.Customer)

            .Include(x => x.Policy)
                .ThenInclude(p => p.PolicyStatus)

            .Include(x => x.Policy)
                .ThenInclude(p => p.Insurer)

            .Include(x => x.Policy)
                .ThenInclude(p => p.Product)

            .Include(x => x.ClaimType)
            .Include(x => x.ClaimStage)
            .Include(x => x.ClaimHandler)
            .AsQueryable();


            // ---------------- SEARCH ----------------
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(x =>
                    x.Customer.FullName.Contains(search) ||
                    x.Policy.PolicyNumber.Contains(search) ||
                    x.Status.Contains(search)
                );
            }

            // ---------------- FILTERS ----------------
            if (customerId.HasValue)
                query = query.Where(x => x.CustomerId == customerId);

            if (policyId.HasValue)
                query = query.Where(x => x.PolicyId == policyId);

            if (claimTypeId.HasValue)
                query = query.Where(x => x.ClaimTypeId == claimTypeId);

            if (claimStageId.HasValue)
                query = query.Where(x => x.ClaimStageId == claimStageId);

            if (claimHandlerId.HasValue)
                query = query.Where(x => x.ClaimHandlerId == claimHandlerId);

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(x => x.Status == status);

            var totalRecords = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (totalRecords, data);
        }
        public async Task DeleteByIdAsync(Guid claimId)
        {
            var claim = await _context.Claims
                .FirstOrDefaultAsync(x => x.ClaimId == claimId);

            if (claim == null)
                return;

            _context.Claims.Remove(claim);
            await _context.SaveChangesAsync();
        }
    }
}