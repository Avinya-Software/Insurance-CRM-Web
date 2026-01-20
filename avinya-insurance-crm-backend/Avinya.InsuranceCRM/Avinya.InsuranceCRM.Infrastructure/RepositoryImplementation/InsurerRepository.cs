using Avinya.InsuranceCRM.API.Helper;
using Avinya.InsuranceCRM.Application.DTOs;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Helper;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class InsurerRepository : IInsurerRepository
    {
        private readonly AppDbContext _context;

        public InsurerRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<Insurer?> GetByIdAsync(
            string advisorId,
            Guid insurerId)
        {
            return await _context.Insurers
                .FirstOrDefaultAsync(x =>
                    x.InsurerId == insurerId &&
                    x.AdvisorId == advisorId);
        }

        public async Task<(IEnumerable<InsurerListDto> Insurers, int TotalCount)>GetFilteredAsync(
            string advisorId,
            string role,
            Guid? companyId,
            string? search,
            int page,
            int pageSize)
        {
            IQueryable<Insurer> query = _context.Insurers;

            if (role == "Advisor")
                query = query.Where(x => x.AdvisorId == advisorId);
            else if (role == "CompanyAdmin")
                query = query.Where(x => x.CompanyId == companyId);

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(x =>
                    x.InsurerName.Contains(search) ||
                    x.ShortCode.Contains(search) ||
                    (x.ContactDetails != null &&
                     x.ContactDetails.Contains(search)));
            }

            var totalCount = await query.CountAsync();

            var insurers = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new InsurerListDto
                {
                    InsurerId = x.InsurerId,
                    InsurerName = x.InsurerName,
                    ShortCode = x.ShortCode,
                    ContactDetails = x.ContactDetails,
                    PortalUrl = x.PortalUrl,
                    PortalUsername = x.PortalUsername,
                    CreatedAt = DateTimeHelper.ConvertUtcToLocal(x.CreatedAt)
                })
                .ToListAsync();

            return (insurers, totalCount);
        }


        public async Task<List<InsurerDropdown>> GetDropdownAsync(
            string advisorId)
        {
            return await _context.Insurers
                .Where(x => x.AdvisorId == advisorId)
                .OrderBy(x => x.InsurerName)
                .Select(x => new InsurerDropdown
                {
                    InsurerId = x.InsurerId,
                    InsurerName = x.InsurerName
                })
                .ToListAsync();
        }


        public async Task<bool> DeleteAsync(
            string advisorId,
            Guid insurerId)
        {
            var insurer = await _context.Insurers
                .FirstOrDefaultAsync(x =>
                    x.InsurerId == insurerId &&
                    x.AdvisorId == advisorId);

            if (insurer == null)
                return false;

            _context.Insurers.Remove(insurer);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<(Insurer insurer, bool isUpdate)> CreateOrUpdateAsync(
            string advisorId,
            Guid companyId,
            CreateOrUpdateInsurerRequest request)
        {
            if (string.IsNullOrEmpty(advisorId))
                throw new UnauthorizedAccessException("Advisor not found");

            if (request.InsurerId.HasValue)
            {
                var insurer = await _context.Insurers
                    .FirstOrDefaultAsync(x =>
                        x.InsurerId == request.InsurerId.Value &&
                        x.AdvisorId == advisorId);

                if (insurer == null)
                    throw new KeyNotFoundException("Insurer not found");

                insurer.InsurerName = request.InsurerName;
                insurer.ShortCode = request.ShortCode;
                insurer.ContactDetails = request.ContactDetails;
                insurer.PortalUrl = request.PortalUrl;
                insurer.PortalUsername = request.PortalUsername;

                if (!string.IsNullOrWhiteSpace(request.PortalPassword))
                    insurer.PortalPassword = EncryptionHelper.Encrypt(request.PortalPassword);

                insurer.UpdatedAt = DateTime.UtcNow;

                _context.Insurers.Update(insurer);
                await _context.SaveChangesAsync();

                return (insurer, true);
            }

            var newInsurer = new Insurer
            {
                InsurerId = Guid.NewGuid(),
                InsurerName = request.InsurerName,
                ShortCode = request.ShortCode,
                ContactDetails = request.ContactDetails,
                PortalUrl = request.PortalUrl,
                PortalUsername = request.PortalUsername,
                PortalPassword = string.IsNullOrWhiteSpace(request.PortalPassword)
                    ? null
                    : EncryptionHelper.Encrypt(request.PortalPassword),
                AdvisorId = advisorId,
                CompanyId = companyId,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Insurers.AddAsync(newInsurer);
            await _context.SaveChangesAsync();

            return (newInsurer, false);
        }

    }
}
