using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
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
