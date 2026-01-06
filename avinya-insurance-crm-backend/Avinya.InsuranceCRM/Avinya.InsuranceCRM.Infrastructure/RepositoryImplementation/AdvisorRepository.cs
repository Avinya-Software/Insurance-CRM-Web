using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class AdvisorRepository : IAdvisorRepository
    {
        private readonly AppDbContext _context;

        public AdvisorRepository(AppDbContext context)
        {
            _context = context;
        }

        // Create Advisor profile (after Identity user creation)
        public async Task<Advisor> AddAsync(Advisor advisor)
        {
            _context.Advisors.Add(advisor);
            await _context.SaveChangesAsync();
            return advisor;
        }

        // Get Advisor profile using Identity UserId
        public async Task<Advisor?> GetByUserIdAsync(string userId)
        {
            return await _context.Advisors
                .FirstOrDefaultAsync(a => a.UserId == userId && a.IsActive);
        }
    }
}
