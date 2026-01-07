using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly AppDbContext _context;

        public CustomerRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsByMobileAsync(string mobile)
        {
            return await _context.Customers
                .AnyAsync(x => x.PrimaryMobile == mobile);
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _context.Customers
                .AnyAsync(x => x.Email == email);
        }

        public async Task<Customer> AddAsync(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer;
        }
        public async Task UpdateAsync(Customer customer)
        {
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();
        }
        public async Task<Customer?> GetByIdAsync(Guid customerId)
        {
            return await _context.Customers
                .FirstOrDefaultAsync(x => x.CustomerId == customerId);
        }
        public async Task<PagedRecordResult<Customer>> GetAllAsync(
     int pageNumber,
     int pageSize,
     string? search)
        {
            var query = _context.Customers.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim().ToLower();

                // Base text search
                query = query.Where(x =>
                    x.FullName.ToLower().Contains(search) ||
                    x.Email.ToLower().Contains(search) ||
                    x.Address.ToLower().Contains(search) ||
                    x.PrimaryMobile.Contains(search)
                );

                // 🔥 OR condition for CustomerId
                if (Guid.TryParse(search, out var customerId))
                {
                    query = query.Union(
                        _context.Customers.Where(x => x.CustomerId == customerId)
                    );
                }
            }

            var totalRecords = await query.CountAsync();

            var customers = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedRecordResult<Customer>
            {
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Data = customers
            };
        }

        public async Task<bool> DeleteAsync(Guid customerId)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(x => x.CustomerId == customerId);

            if (customer == null)
                return false;

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<List<Customer>> GetDropdownAsync()
        {
            return await _context.Customers
                .OrderBy(x => x.FullName)
                .Select(x => new Customer
                {
                    CustomerId = x.CustomerId,
                    FullName = x.FullName,
                    Email = x.Email,
                    DOB = x.DOB,
                    Anniversary = x.Anniversary,
                    PrimaryMobile=x.PrimaryMobile,
                    Address=x.Address
                })
                .ToListAsync();
        }
        public async Task<bool> ExistsByEmailAsync(
           string email,
           Guid excludeCustomerId)
        {
            return await _context.Customers.AnyAsync(c =>
                c.Email == email &&
                c.CustomerId != excludeCustomerId
            );
        }

        public async Task<bool> ExistsByMobileAsync(
            string mobile,
            Guid excludeCustomerId)
        {
            return await _context.Customers.AnyAsync(c =>
                c.PrimaryMobile == mobile &&
                c.CustomerId != excludeCustomerId
            );
        }
        public async Task DeleteByIdAsync(Guid customerId)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (customer == null)
                return;

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
        }

    }
}
