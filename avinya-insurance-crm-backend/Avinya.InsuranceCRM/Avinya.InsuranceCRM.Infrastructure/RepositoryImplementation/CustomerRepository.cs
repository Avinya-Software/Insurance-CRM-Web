using Avinya.InsuranceCRM.Application.DTOs;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Helper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _config;

        public CustomerRepository(AppDbContext context, IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor, IConfiguration config)
        {
            _context = context;
            _env = env;
            _httpContextAccessor = httpContextAccessor;
            _config = config;

        }

        public async Task<(Customer customer, bool isUpdate)> CreateOrUpdateAsync(
            string advisorId,
            Guid? companyId,
            CreateCustomerRequest request)
        {
                Customer customer;
                bool isUpdate = request.CustomerId.HasValue;

                if (isUpdate)
                {
                    customer = await _context.Customers.FirstOrDefaultAsync(x =>
                        x.CustomerId == request.CustomerId &&
                        x.AdvisorId == advisorId)
                        ?? throw new KeyNotFoundException("Customer not found");

                    customer.FullName = request.FullName;
                    customer.PrimaryMobile = request.PrimaryMobile;
                    customer.SecondaryMobile = request.SecondaryMobile;
                    customer.Email = request.Email;
                    customer.Address = request.Address;
                    customer.DOB = request.DOB;
                    customer.Anniversary = request.Anniversary;
                    customer.Notes = request.Notes;
                    customer.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    customer = new Customer
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

                    _context.Customers.Add(customer);
                }

                if (request.KYCFiles != null && request.KYCFiles.Any())
                {
                var uploadRoot = Path.Combine(
                     _env.WebRootPath,
                     "Uploads",
                     "Customers",
                     customer.CustomerId.ToString()
                 );

                if (!Directory.Exists(uploadRoot))
                        Directory.CreateDirectory(uploadRoot);

                    var newFiles = new List<string>();

                    foreach (var file in request.KYCFiles)
                    {
                        var ext = Path.GetExtension(file.FileName).ToLower();
                        var allowedExt = new[] { ".jpg", ".jpeg", ".png", ".pdf" };

                        if (!allowedExt.Contains(ext))
                            throw new Exception("Only jpg, jpeg, png and pdf files are allowed");

                        var fileName = $"{Guid.NewGuid()}{ext}";
                        var filePath = Path.Combine(uploadRoot, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        newFiles.Add($"/Uploads/Customers/{customer.CustomerId}/{fileName}");
                }

                if (!string.IsNullOrWhiteSpace(customer.KYCFiles))
                    {
                        var existingFiles = customer.KYCFiles.Split(",", StringSplitOptions.RemoveEmptyEntries).ToList();
                        existingFiles.AddRange(newFiles);
                        customer.KYCFiles = string.Join(",", existingFiles);
                    }
                    else
                    {
                        customer.KYCFiles = string.Join(",", newFiles);
                    }

                    customer.KYCUploadedDate = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
                return (customer, isUpdate);
            
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
            if (customerId == Guid.Empty || string.IsNullOrWhiteSpace(documentId))
                return null;

            if (documentId.Contains("..") || documentId.Contains("/") || documentId.Contains("\\"))
                return null;

            var baseUrl = _config["ApiSettings:BaseUrl"];

            if (string.IsNullOrWhiteSpace(baseUrl))
                return null;

            return $"{baseUrl}/Uploads/Customers/{customerId}/{documentId}";
        }

    }
}
