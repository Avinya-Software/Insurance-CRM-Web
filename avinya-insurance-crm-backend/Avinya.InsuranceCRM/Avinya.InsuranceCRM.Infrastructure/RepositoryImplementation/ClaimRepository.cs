using Avinya.InsuranceCRM.Application.RepositoryInterface;
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

        /* ================= GET BY ID ================= */

        public async Task<InsuranceClaim?> GetByIdAsync(
            string advisorId,
            Guid claimId)
        {
            return await _context.Claims
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
                .FirstOrDefaultAsync(x =>
                    x.ClaimId == claimId &&
                    x.AdvisorId == advisorId);
        }

        /* ================= CREATE ================= */

        public async Task AddAsync(
            InsuranceClaim claim,
            string advisorId)
        {
            // 🔐 Enforce ownership
            claim.AdvisorId = advisorId;
            claim.CreatedAt = DateTime.UtcNow;

            await _context.Claims.AddAsync(claim);
            await _context.SaveChangesAsync();
        }

        /* ================= UPDATE ================= */

        public async Task UpdateAsync(
            InsuranceClaim claim,
            string advisorId)
        {
            var existing = await _context.Claims
                .FirstOrDefaultAsync(x =>
                    x.ClaimId == claim.ClaimId &&
                    x.AdvisorId == advisorId);

            if (existing == null)
                return;

            existing.PolicyId = claim.PolicyId;
            existing.CustomerId = claim.CustomerId;
            existing.ClaimTypeId = claim.ClaimTypeId;
            existing.ClaimStageId = claim.ClaimStageId;
            existing.ClaimHandlerId = claim.ClaimHandlerId;
            existing.IncidentDate = claim.IncidentDate;
            existing.ClaimAmount = claim.ClaimAmount;
            existing.ApprovedAmount = claim.ApprovedAmount;
            existing.Documents = claim.Documents;
            existing.Status = claim.Status;
            existing.TATDays = claim.TATDays;
            existing.Notes = claim.Notes;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        /* ================= PAGED LIST ================= */

        public async Task<(int TotalRecords, List<InsuranceClaim> Data)> GetPagedAsync(
            string advisorId,
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
                .AsNoTracking()
                .Where(x => x.AdvisorId == advisorId)

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

            /* -------- SEARCH -------- */
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(x =>
                    x.Customer.FullName.Contains(search) ||
                    x.Policy.PolicyNumber.Contains(search) ||
                    x.Status.Contains(search));
            }

            /* -------- FILTERS -------- */
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

        /* ================= DELETE ================= */

        public async Task DeleteByIdAsync(
            string advisorId,
            Guid claimId)
        {
            var claim = await _context.Claims
                .FirstOrDefaultAsync(x =>
                    x.ClaimId == claimId &&
                    x.AdvisorId == advisorId);

            if (claim == null)
                return;

            _context.Claims.Remove(claim);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> UpdateClaimStageAsync(
    string advisorId,
    Guid claimId,
    int claimStageId,
    string? notes)
        {
            var claim = await _context.Claims
                .FirstOrDefaultAsync(c =>
                    c.ClaimId == claimId &&
                    c.AdvisorId == advisorId);

            if (claim == null)
                return false;

            claim.ClaimStageId = claimStageId;

            if (!string.IsNullOrWhiteSpace(notes))
                claim.Notes = notes;

            // Optional: auto status mapping
            claim.Status = claimStageId switch
            {
                1 => "Open",        
                2 => "Open",       
                3 => "In Review",  
                4 => "Approved",
                5 => "Rejected",
                6 => "Closed",      
                _ => claim.Status
            };

            claim.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

    }
}
