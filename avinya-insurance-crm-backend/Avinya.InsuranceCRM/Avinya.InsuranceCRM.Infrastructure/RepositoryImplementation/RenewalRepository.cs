using Avinya.InsuranceCRM.Application.DTOs.Renewal;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Domain.Entities;
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

        public async Task<Guid> UpsertAsync(UpsertRenewalDto dto, string advisorId, Guid? companyId)
        {
            Renewal entity;

            if (!dto.RenewalId.HasValue || dto.RenewalId == Guid.Empty)
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
            else
            {
                entity = await _context.Renewals.FirstOrDefaultAsync(x =>
                    x.RenewalId == dto.RenewalId &&
                    x.AdvisorId == advisorId)
                    ?? throw new KeyNotFoundException("Renewal not found");

                entity.UpdatedAt = DateTime.UtcNow;
            }

            entity.PolicyId = dto.PolicyId;
            entity.CustomerId = dto.CustomerId;
            entity.RenewalDate = dto.RenewalDate;
            entity.RenewalPremium = dto.RenewalPremium;
            entity.RenewalStatusId = dto.RenewalStatusId;
            entity.ReminderDatesJson = dto.ReminderDatesJson;
            entity.CompanyId = companyId;

            await _context.SaveChangesAsync();
            return entity.RenewalId;
        }

        public async Task<(List<RenewalListDto> Data, int TotalCount)> GetPagedAsync(
            string advisorId,
            string role,
            Guid? companyId,
            int pageNumber,
            int pageSize,
            string? search,
            int? renewalStatusId)
        {
            IQueryable<Renewal> query = _context.Renewals
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Policy)
                .Include(x => x.RenewalStatus);

            if (role == "Advisor")
            {
                query = query.Where(x => x.AdvisorId == advisorId);
            }
            else if (role == "CompanyAdmin" && companyId.HasValue)
            {
                query = query.Where(x => x.CompanyId == companyId);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(x =>
                    x.Customer.FullName.Contains(search) ||
                    x.Policy.PolicyCode.Contains(search));
            }

            if (renewalStatusId.HasValue)
            {
                query = query.Where(x => x.RenewalStatusId == renewalStatusId.Value);
            }

            var totalCount = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new RenewalListDto
                {
                    RenewalId = x.RenewalId,
                    RenewalDate = x.RenewalDate,
                    RenewalPremium = x.RenewalPremium,
                    CustomerId = x.CustomerId,
                    PolicyId = x.PolicyId,
                    CustomerName = x.Customer.FullName,
                    PolicyCode = x.Policy.PolicyCode,
                    Status = x.RenewalStatus.StatusName,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();

            return (data, totalCount);
        }


        public async Task<bool> DeleteAsync(Guid renewalId, string advisorId)
        {
            var renewal = await _context.Renewals
                .FirstOrDefaultAsync(x => x.RenewalId == renewalId && x.AdvisorId == advisorId);

            if (renewal == null)
                return false;

            _context.Renewals.Remove(renewal);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateStatusAsync(string advisorId, Guid renewalId, int statusId)
        {
            var renewal = await _context.Renewals
                .FirstOrDefaultAsync(x => x.RenewalId == renewalId && x.AdvisorId == advisorId);

            if (renewal == null)
                return false;

            renewal.RenewalStatusId = statusId;
            renewal.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<RenewalStatusDropdownDto>> GetStatusesAsync()
        {
            return await _context.RenewalStatuses
                .Where(x => x.IsActive)
                .OrderBy(x => x.RenewalStatusId)
                .Select(x => new RenewalStatusDropdownDto
                {
                    Id = x.RenewalStatusId,
                    Name = x.StatusName
                })
                .ToListAsync();
        }
    }
}
