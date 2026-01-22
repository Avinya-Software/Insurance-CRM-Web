using Avinya.InsuranceCRM.Application.DTOs.CustomerPolicy;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class CustomerPolicyRepository : ICustomerPolicyRepository
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CustomerPolicyRepository(
            AppDbContext context,
            IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<(CustomerPolicy policy, bool isUpdate)> CreateOrUpdateAsync(
    string advisorId,
    Guid companyId,
    UpsertPolicyRequest request)
        {
            CustomerPolicy policy;
            bool isUpdate = request.PolicyId.HasValue;

            if (isUpdate)
            {
                policy = await _context.CustomerPolicies
                    .FirstOrDefaultAsync(x =>
                        x.PolicyId == request.PolicyId.Value &&
                        x.AdvisorId == advisorId);

                if (policy == null)
                    throw new KeyNotFoundException("Policy not found");

                policy.CustomerId = request.CustomerId;
                policy.InsurerId = request.InsurerId;
                policy.ProductId = request.ProductId;
                policy.PolicyStatusId = request.PolicyStatusId;
                policy.PolicyTypeId = request.PolicyTypeId;

                policy.RegistrationNo = request.RegistrationNo;
                policy.StartDate = request.StartDate;
                policy.EndDate = request.EndDate;
                policy.PremiumNet = request.PremiumNet;
                policy.PremiumGross = request.PremiumGross;

                policy.PaymentMode = request.PaymentMode;
                policy.PaymentDueDate = request.PaymentDueDate;
                policy.RenewalDate = request.RenewalDate;

                policy.BrokerCode = request.BrokerCode;
                policy.PolicyCode = request.PolicyCode;
                policy.PaymentDone = request.PaymentDone;

                policy.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                policy = new CustomerPolicy
                {
                    PolicyId = Guid.NewGuid(),
                    AdvisorId = advisorId,
                    CompanyId = companyId,

                    CustomerId = request.CustomerId,
                    InsurerId = request.InsurerId,
                    ProductId = request.ProductId,
                    PolicyStatusId = request.PolicyStatusId,
                    PolicyTypeId = request.PolicyTypeId,

                    RegistrationNo = request.RegistrationNo,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    PremiumNet = request.PremiumNet,
                    PremiumGross = request.PremiumGross,

                    PaymentMode = request.PaymentMode,
                    PaymentDueDate = request.PaymentDueDate,
                    RenewalDate = request.RenewalDate,

                    BrokerCode = request.BrokerCode,
                    PolicyCode = request.PolicyCode,
                    PaymentDone = request.PaymentDone,

                    PolicyNumber = await GeneratePolicyNumberAsync(advisorId),
                    CreatedAt = DateTime.UtcNow
                };

                _context.CustomerPolicies.Add(policy);
            }

            if (request.PolicyDocuments != null && request.PolicyDocuments.Any())
            {
                var uploadRoot = Path.Combine(
                    _env.ContentRootPath,
                    "Uploads",
                    "Policies",
                    policy.PolicyId.ToString()
                );

                Directory.CreateDirectory(uploadRoot);

                var savedFiles = new List<string>();

                foreach (var file in request.PolicyDocuments)
                {
                    if (file.Length == 0) continue;

                    var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                    var filePath = Path.Combine(uploadRoot, fileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);

                    savedFiles.Add(fileName);
                }

                // Append existing documents (important for update)
                var existingFiles = policy.PolicyDocumentRef?
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(x => x.Trim())
                    .ToList() ?? new List<string>();

                existingFiles.AddRange(savedFiles);

                policy.PolicyDocumentRef = string.Join(",", existingFiles);
            }

            await _context.SaveChangesAsync();
            return (policy, isUpdate);
        }



        public async Task<object> GetPoliciesAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            string? search,
            int? policyStatusId,
            int? policyTypeId,
            Guid? customerId,
            Guid? insurerId,
            Guid? productId)
        {
            var query = _context.CustomerPolicies
                .AsNoTracking()
                .Where(x => x.AdvisorId == advisorId);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(x =>
                    x.PolicyNumber.Contains(search) ||
                    x.RegistrationNo.Contains(search));

            if (policyStatusId.HasValue)
                query = query.Where(x => x.PolicyStatusId == policyStatusId);

            if (policyTypeId.HasValue)
                query = query.Where(x => x.PolicyTypeId == policyTypeId);

            if (customerId.HasValue)
                query = query.Where(x => x.CustomerId == customerId);

            if (insurerId.HasValue)
                query = query.Where(x => x.InsurerId == insurerId);

            if (productId.HasValue)
                query = query.Where(x => x.ProductId == productId);

            var totalRecords = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new
                {
                    x.PolicyId,
                    x.PolicyNumber,
                    x.RegistrationNo,
                    x.StartDate,
                    x.EndDate,
                    x.PremiumNet,
                    x.PremiumGross,
                    x.PolicyCode,
                    x.PaymentMode,
                    x.PaymentDueDate,
                    x.RenewalDate,
                    x.PaymentDone,
                    PolicyStatusName = x.PolicyStatus.StatusName,
                    PolicyTypeName = x.PolicyType.TypeName,
                    CustomerName = x.Customer.FullName,
                    InsurerName = x.Insurer.InsurerName,
                    ProductName = x.Product.ProductName,
                    x.PolicyDocumentRef,
                    x.CreatedAt
                })
                .ToListAsync();

            return new
            {
                TotalRecords = totalRecords,
                Page = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalRecords / (double)pageSize),
                Data = data
            };
        }


        public async Task<bool> DeleteByIdAsync(
            string advisorId,
            Guid policyId)
        {
            var policy = await _context.CustomerPolicies
                .FirstOrDefaultAsync(x =>
                    x.PolicyId == policyId &&
                    x.AdvisorId == advisorId);

            if (policy == null)
                return false;

            _context.CustomerPolicies.Remove(policy);
            await _context.SaveChangesAsync();

            var folder = Path.Combine(
                _env.ContentRootPath,
                "Uploads",
                "Policies",
                policyId.ToString());

            if (Directory.Exists(folder))
                Directory.Delete(folder, true);

            return true;
        }


        public async Task<bool> DeleteDocumentAsync(
            string advisorId,
            Guid policyId,
            string documentId)
        {
            var policy = await _context.CustomerPolicies
                .FirstOrDefaultAsync(x =>
                    x.PolicyId == policyId &&
                    x.AdvisorId == advisorId);

            if (policy == null || string.IsNullOrWhiteSpace(policy.PolicyDocumentRef))
                return false;

            var files = policy.PolicyDocumentRef.Split(",").ToList();
            var file = files.FirstOrDefault(x => x.StartsWith(documentId + "_"));
            if (file == null) return false;

            var path = GetPolicyDocumentPath(policyId, documentId);
            if (path != null && File.Exists(path))
                File.Delete(path);

            files.Remove(file);
            policy.PolicyDocumentRef = files.Any()
                ? string.Join(",", files)
                : null;

            policy.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        public string? GetPolicyDocumentPath(Guid policyId, string documentId)
        {
            var folder = Path.Combine(
                _env.ContentRootPath,
                "Uploads",
                "Policies",
                policyId.ToString());

            if (!Directory.Exists(folder))
                return null;

            return Directory.GetFiles(folder)
                .FirstOrDefault(f =>
                    Path.GetFileName(f).StartsWith(documentId + "_"));
        }


        public async Task<bool> UpdatePolicyStatusAsync(
            string advisorId,
            Guid policyId,
            int policyStatusId)
        {
            var policy = await _context.CustomerPolicies
                .FirstOrDefaultAsync(x =>
                    x.PolicyId == policyId &&
                    x.AdvisorId == advisorId);

            if (policy == null)
                return false;

            policy.PolicyStatusId = policyStatusId;
            policy.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<List<PolicyTypeMaster>> GetPolicyTypesAsync()
            => await _context.PolicyTypes
                .Where(x => x.IsActive)
                .OrderBy(x => x.TypeName)
                .ToListAsync();

        public async Task<List<PolicyStatusMaster>> GetPolicyStatusesAsync()
            => await _context.PolicyStatuses
                .Where(x => x.IsActive)
                .OrderBy(x => x.StatusName)
                .ToListAsync();

        public async Task<List<CustomerPolicy>> GetPoliciesForDropdownAsync(
            string advisorId,
            Guid? customerId)
        {
            var query = _context.CustomerPolicies
                .AsNoTracking()
                .Where(x => x.AdvisorId == advisorId);

            if (customerId.HasValue)
                query = query.Where(x => x.CustomerId == customerId);

            return await query
                .OrderBy(x => x.PolicyNumber)
                .Select(x => new CustomerPolicy
                {
                    PolicyId = x.PolicyId,
                    PolicyNumber = x.PolicyNumber,
                    PolicyCode = x.PolicyCode,
                    RenewalDate = x.RenewalDate,
                    PremiumGross = x.PremiumGross
                })
                .ToListAsync();
        }


        private async Task<string> GeneratePolicyNumberAsync(string advisorId)
        {
            var last = await _context.CustomerPolicies
                .Where(x => x.AdvisorId == advisorId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => x.PolicyNumber)
                .FirstOrDefaultAsync();

            int next = last != null && int.TryParse(last.Split('-').Last(), out var n)
                ? n + 1
                : 1;

            return $"POL-{next:D6}";
        }

        public async Task<CustomerPolicy?> GetByIdAsync(
        string advisorId,
        Guid policyId)
            {
                return await _context.CustomerPolicies
                    .AsNoTracking()
                    .Include(x => x.Customer)
                    .Include(x => x.Insurer)
                    .Include(x => x.Product)
                    .Include(x => x.PolicyStatus)
                    .Include(x => x.PolicyType)
                    .FirstOrDefaultAsync(x =>
                        x.PolicyId == policyId &&
                        x.AdvisorId == advisorId);
            }

        }
}
