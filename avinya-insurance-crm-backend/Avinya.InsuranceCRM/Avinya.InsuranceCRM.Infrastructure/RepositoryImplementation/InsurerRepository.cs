using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class InsurerRepository : IInsurerRepository
    {
        private readonly AppDbContext _context;

        public InsurerRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Insurer?> GetByIdAsync(Guid insurerId)
        {
            return await _context.Insurers
                .FirstOrDefaultAsync(x => x.InsurerId == insurerId);
        }

        public async Task AddAsync(Insurer insurer)
        {
            _context.Insurers.Add(insurer);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Insurer insurer)
        {
            _context.Insurers.Update(insurer);
            await _context.SaveChangesAsync();
        }
        public async Task<PagedRecordResult<Insurer>> GetPagedAsync(int pageNumber,int pageSize,string? search)
        {
            var query = _context.Insurers.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();

                query = query.Where(x =>
                    x.InsurerName.ToLower().Contains(search) ||
                    x.ShortCode.ToLower().Contains(search) ||
                    (x.ContactDetails != null &&
                     x.ContactDetails.ToLower().Contains(search))
                );
            }

            var totalRecords = await query.CountAsync();

            var insurers = await query
                .OrderBy(x => x.InsurerName)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedRecordResult<Insurer>
            {
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Data = insurers
            };
        }
        public async Task<List<Insurer>> GetDropdownAsync()
        {
            return await _context.Insurers
                .OrderBy(x => x.InsurerName)
                .Select(x => new Insurer
                {
                    InsurerId = x.InsurerId,
                    InsurerName = x.InsurerName
                })
                .ToListAsync();
        }
        public async Task<bool> DeleteAsync(Guid insurerId)
        {
            var insurer = await _context.Insurers
                .FirstOrDefaultAsync(x => x.InsurerId == insurerId);

            if (insurer == null)
                return false;

            _context.Insurers.Remove(insurer);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
