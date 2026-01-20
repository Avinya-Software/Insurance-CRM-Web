using Avinya.InsuranceCRM.Application.DTOs;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Helper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CustomerRepository(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<(Customer customer, bool isUpdate)> CreateOrUpdateAsync(
            string advisorId,
            Guid? companyId,
            CreateCustomerRequest request)
        {
            if (request.CustomerId.HasValue)
            {
                var customer = await _context.Customers.FirstOrDefaultAsync(x =>
                    x.CustomerId == request.CustomerId &&
                    x.AdvisorId == advisorId);

                if (customer == null)
                    throw new KeyNotFoundException("Customer not found");

                if (await _context.Customers.AnyAsync(x =>
                        x.AdvisorId == advisorId &&
                        x.PrimaryMobile == request.PrimaryMobile &&
                        x.CustomerId != customer.CustomerId))
                    throw new Exception("Mobile already exists");

                customer.FullName = request.FullName;
                customer.PrimaryMobile = request.PrimaryMobile;
                customer.SecondaryMobile = request.SecondaryMobile;
                customer.Email = request.Email;
                customer.Address = request.Address;
                customer.DOB = request.DOB;
                customer.Anniversary = request.Anniversary;
                customer.Notes = request.Notes;
                customer.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return (customer, true);
            }

            if (await _context.Customers.AnyAsync(x =>
                    x.AdvisorId == advisorId &&
                    x.PrimaryMobile == request.PrimaryMobile))
                throw new Exception("Mobile already exists");

            var newCustomer = new Customer
            {
                CustomerId = Guid.NewGuid(),
                FullName = request.FullName,
                PrimaryMobile = request.PrimaryMobile,
                SecondaryMobile = request.SecondaryMobile,
                Email = request.Email,
                Address = request.Address,
                DOB = request.DOB,
                Anniversary = request.Anniversary,
                Notes = request.Notes,
                AdvisorId = advisorId,
                CompanyId = companyId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Customers.Add(newCustomer);
            await _context.SaveChangesAsync();

            return (newCustomer, false);
        }

        public async Task<(IEnumerable<CustomerListDto> Data, int TotalCount)> GetPagedAsync(
            string advisorId,
            string role,
            Guid? companyId,
            int pageNumber,
            int pageSize,
            string? search)
        {
            IQueryable<Customer> baseQuery = _context.Customers.AsNoTracking();

            if (role == "Advisor")
            {
                baseQuery = baseQuery.Where(x => x.AdvisorId == advisorId);
            }
            else if (role == "CompanyAdmin" && companyId.HasValue)
            {
                baseQuery = baseQuery.Where(x => x.CompanyId == companyId);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                baseQuery = baseQuery.Where(x =>
                    x.FullName.Contains(search) ||
                    x.Email.Contains(search) ||
                    x.PrimaryMobile.Contains(search));
            }

            var totalCount = await baseQuery.CountAsync();

            var customers = await baseQuery
                .OrderByDescending(x => x.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(customer => new CustomerListDto
                {
                    CustomerId = customer.CustomerId,
                    FullName = customer.FullName,
                    PrimaryMobile = customer.PrimaryMobile,
                    SecondaryMobile = customer.SecondaryMobile,
                    Email = customer.Email,
                    Address = customer.Address,

                    CompanyId = customer.CompanyId,
                    CompanyName = _context.Companies
                        .Where(c => c.CompanyId == customer.CompanyId)
                        .Select(c => c.CompanyName)
                        .FirstOrDefault(),

                    DOB = customer.DOB,
                    Anniversary = customer.Anniversary,
                    KYCStatus = customer.KYCStatus,

                    CreatedAt = DateTimeHelper.ConvertUtcToLocal(customer.CreatedAt),

                    Campaigns = _context.CampaignCustomers
                        .Where(cc =>
                            cc.CustomerId == customer.CustomerId &&
                            cc.IsActive)
                        .Select(cc => new CustomerCampaignDto
                        {
                            CampaignCustomerId = cc.CampaignCustomerId,
                            CampaignId = cc.CampaignId,

                            Name = _context.Campaigns
                                .Where(c => c.CampaignId == cc.CampaignId)
                                .Select(c => c.Name)
                                .FirstOrDefault()!,

                            CampaignType = _context.Campaigns
                                .Where(c => c.CampaignId == cc.CampaignId)
                                .Select(c => c.CampaignType)
                                .FirstOrDefault()!,

                            StartDate = _context.Campaigns
                                .Where(c => c.CampaignId == cc.CampaignId)
                                .Select(c => c.StartDate)
                                .FirstOrDefault(),

                            EndDate = _context.Campaigns
                                .Where(c => c.CampaignId == cc.CampaignId)
                                .Select(c => c.EndDate)
                                .FirstOrDefault()
                        })
                        .ToList()
                })
                .ToListAsync();

            return (customers, totalCount);
        }

        public async Task<bool> DeleteAsync(string advisorId, Guid customerId)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(x =>
                x.CustomerId == customerId &&
                x.AdvisorId == advisorId);

            if (customer == null) return false;

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Customer>> GetDropdownAsync(string advisorId)
            => await _context.Customers
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

        public async Task<bool> DeleteKycFileAsync(
            string advisorId,
            Guid customerId,
            string documentId)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(x =>
                x.CustomerId == customerId &&
                x.AdvisorId == advisorId);

            if (customer == null || string.IsNullOrWhiteSpace(customer.KYCFiles))
                return false;

            var files = customer.KYCFiles.Split(",").ToList();
            var file = files.FirstOrDefault(x => x.StartsWith(documentId + "_"));
            if (file == null) return false;

            files.Remove(file);
            customer.KYCFiles = files.Any() ? string.Join(",", files) : null;
            customer.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public string? GetKycFilePath(Guid customerId, string documentId)
        {
            var folder = Path.Combine(
                _env.ContentRootPath,
                "Uploads",
                "KYC",
                customerId.ToString()
            );

            if (!Directory.Exists(folder))
                return null;

            return Directory.GetFiles(folder)
                .FirstOrDefault(f =>
                    Path.GetFileName(f).StartsWith(documentId + "_"));
        }
    }
}
