using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class LeadFollowUpRepository : ILeadFollowUpRepository
    {
        private readonly AppDbContext _context;

        public LeadFollowUpRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(LeadFollowUp followUp)
        {
            _context.LeadFollowUps.Add(followUp);
            await _context.SaveChangesAsync();
        }
        public async Task<List<LeadFollowUp>> GetByLeadIdAsync(Guid leadId)
        {
            return await _context.LeadFollowUps
                .Where(x => x.LeadId == leadId)
                .OrderByDescending(x => x.FollowUpDate)
                .ToListAsync();
        }
        public Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return _context.Database.BeginTransactionAsync();
        }

    }
}
