using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class EmailRepository : IEmailRepository
    {
        private readonly AppDbContext _db;

        public EmailRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<string?> GetCustomerEmailAsync(Guid customerId)
        {
            return await _db.Customers
                .Where(x => x.CustomerId == customerId)
                .Select(x => x.Email)
                .FirstOrDefaultAsync();
        }

        public async Task<string?> GetCustomerNameAsync(Guid customerId)
        {
            return await _db.Customers
                .Where(x => x.CustomerId == customerId)
                .Select(x => x.FullName)
                .FirstOrDefaultAsync();
        }
    }
}
