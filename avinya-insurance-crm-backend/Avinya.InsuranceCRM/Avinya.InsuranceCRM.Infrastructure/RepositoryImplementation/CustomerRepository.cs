using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly AppDbContext _context;

        public CustomerRepository(AppDbContext context)
        {
            _context = context;
        }

        /* ================= VALIDATIONS ================= */

        public async Task<bool> ExistsByMobileAsync(string advisorId, string mobile)
        {
            return await _context.Customers.AnyAsync(x =>
                x.AdvisorId == advisorId &&
                x.PrimaryMobile == mobile);
        }

        public async Task<bool> ExistsByEmailAsync(string advisorId, string email)
        {
            return await _context.Customers.AnyAsync(x =>
                x.AdvisorId == advisorId &&
                x.Email == email);
        }

        public async Task<bool> ExistsByEmailAsync(
            string advisorId,
            string email,
            Guid excludeCustomerId)
        {
            return await _context.Customers.AnyAsync(x =>
                x.AdvisorId == advisorId &&
                x.Email == email &&
                x.CustomerId != excludeCustomerId);
        }

        public async Task<bool> ExistsByMobileAsync(
            string advisorId,
            string mobile,
            Guid excludeCustomerId)
        {
            return await _context.Customers.AnyAsync(x =>
                x.AdvisorId == advisorId &&
                x.PrimaryMobile == mobile &&
                x.CustomerId != excludeCustomerId);
        }

        /* ================= CREATE / UPDATE ================= */

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

        /* ================= READ ================= */

        public async Task<Customer?> GetByIdAsync(string advisorId, Guid customerId)
        {
            return await _context.Customers.FirstOrDefaultAsync(x =>
                x.CustomerId == customerId &&
                x.AdvisorId == advisorId);
        }

        public async Task<PagedRecordResult<Customer>> GetAllAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            string? search)
        {
            var query = _context.Customers
                .Where(x => x.AdvisorId == advisorId);

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim().ToLower();

                query = query.Where(x =>
                    x.FullName.ToLower().Contains(search) ||
                    x.Email.ToLower().Contains(search) ||
                    x.PrimaryMobile.Contains(search) ||
                    (x.Address != null && x.Address.ToLower().Contains(search))
                );

                if (Guid.TryParse(search, out var customerId))
                {
                    query = query.Union(
                        _context.Customers.Where(x =>
                            x.CustomerId == customerId &&
                            x.AdvisorId == advisorId)
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

        public async Task<List<Customer>> GetDropdownAsync(string advisorId)
        {
            return await _context.Customers
                .Where(x => x.AdvisorId == advisorId)
                .OrderBy(x => x.FullName)
                .Select(x => new Customer
                {
                    CustomerId = x.CustomerId,
                    FullName = x.FullName,
                    Email = x.Email,
                    PrimaryMobile = x.PrimaryMobile,
                    DOB = x.DOB,
                    Anniversary = x.Anniversary,
                    Address = x.Address
                })
                .ToListAsync();
        }

        /* ================= DELETE ================= */

        public async Task<bool> DeleteAsync(string advisorId, Guid customerId)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(x =>
                x.CustomerId == customerId &&
                x.AdvisorId == advisorId);

            if (customer == null)
                return false;

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
