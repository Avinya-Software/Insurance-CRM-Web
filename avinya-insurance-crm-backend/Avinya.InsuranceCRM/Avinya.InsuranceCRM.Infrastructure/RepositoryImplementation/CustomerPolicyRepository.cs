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

        public async Task<(PolicyUpsertResponseDto response, bool isUpdate)> CreateOrUpdateAsync(
    string advisorId,
    Guid companyId,
    UpsertPolicyRequest request)
        {
            bool isUpdate = request.PolicyId.HasValue;
            Guid policyId;
            string policyNumber;
            CustomerPolicy policyEntity;

            if (isUpdate)
            {
                policyEntity = await _context.CustomerPolicies
                    .FirstOrDefaultAsync(x =>
                        x.PolicyId == request.PolicyId.Value &&
                        x.AdvisorId == advisorId);

                if (policyEntity == null)
                    throw new KeyNotFoundException("Policy not found");

                policyEntity.CustomerId = request.CustomerId;
                policyEntity.InsurerId = request.InsurerId;
                policyEntity.ProductId = request.ProductId;
                policyEntity.PolicyStatusId = request.PolicyStatusId;
                policyEntity.PolicyTypeId = request.PolicyTypeId;

                policyEntity.RegistrationNo = request.RegistrationNo;
                policyEntity.StartDate = request.StartDate;
                policyEntity.EndDate = request.EndDate;
                policyEntity.PremiumNet = request.PremiumNet;
                policyEntity.PremiumGross = request.PremiumGross;

                policyEntity.PaymentMode = request.PaymentMode;
                policyEntity.PaymentDueDate = request.PaymentDueDate;
                policyEntity.RenewalDate = request.RenewalDate;

                policyEntity.BrokerCode = request.BrokerCode;
                policyEntity.PolicyCode = request.PolicyCode;
                policyEntity.PaymentDone = request.PaymentDone;
                policyEntity.UpdatedAt = DateTime.UtcNow;

                policyId = policyEntity.PolicyId;
                policyNumber = policyEntity.PolicyNumber!;
            }
            else
            {
                policyId = Guid.NewGuid();
                policyNumber = await GeneratePolicyNumberAsync(advisorId);

                policyEntity = new CustomerPolicy
                {
                    PolicyId = policyId,
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
                    PolicyNumber = policyNumber,
                    CreatedAt = DateTime.UtcNow
                };

                _context.CustomerPolicies.Add(policyEntity);

                var lead = await _context.Leads
                    .FirstOrDefaultAsync(x =>
                    x.CustomerId == request.CustomerId &&
                    x.AdvisorId == advisorId);

                if (lead != null)
                {
                    lead.LeadStatusId = 5; 
                    lead.IsConverted = true;
                    lead.UpdatedAt = DateTime.UtcNow;
                }

            }

            if (request.PolicyDocuments?.Any() == true)
            {
                var folderPath = Path.Combine(
                    _env.WebRootPath,
                    "Uploads",
                    "Policies",
                    policyId.ToString()
                );

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var savedFiles = new List<string>();
                string allowedExtension = null;

                foreach (var document in request.PolicyDocuments)
                {
                    if (string.IsNullOrWhiteSpace(document))
                        continue;

                    string header = null;
                    string base64Data;

                    if (document.Contains(","))
                    {
                        var parts = document.Split(',');
                        if (parts.Length != 2)
                            continue;

                        header = parts[0];
                        base64Data = parts[1];
                    }
                    else
                    {
                        base64Data = document;
                    }

                    string extension;

                    if (header != null && header.Contains("application/pdf"))
                        extension = ".pdf";
                    else if (header != null && header.Contains("image/jpeg"))
                        extension = ".jpg";
                    else if (header != null && header.Contains("image/png"))
                        extension = ".png";
                    else
                        extension = ".png"; 

                    if (allowedExtension == null)
                        allowedExtension = extension;
                    else if (allowedExtension != extension)
                        continue; 

                    byte[] fileBytes;
                    try
                    {
                        fileBytes = Convert.FromBase64String(base64Data);
                    }
                    catch
                    {
                        continue; 
                    }

                    var fileName = $"policy_{DateTime.UtcNow.Ticks}{extension}";
                    var filePath = Path.Combine(folderPath, fileName);

                    await System.IO.File.WriteAllBytesAsync(filePath, fileBytes);

                    var webPath = $"/Uploads/Policies/{policyId}/{fileName}";
                    savedFiles.Add(webPath);
                }

                if (savedFiles.Any())
                {
                    var existingDocs = string.IsNullOrEmpty(policyEntity.PolicyDocumentRef)
                        ? new List<string>()
                        : policyEntity.PolicyDocumentRef.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList();

                    existingDocs.AddRange(savedFiles);
                    policyEntity.PolicyDocumentRef = string.Join(",", existingDocs);
                }
            }


            await _context.SaveChangesAsync();

            var responseDto = new PolicyUpsertResponseDto
            {
                PolicyId = policyId,
                CustomerId = policyEntity.CustomerId,
                InsurerId = policyEntity.InsurerId,
                ProductId = policyEntity.ProductId,
                PolicyStatusId = policyEntity.PolicyStatusId,
                PolicyTypeId = policyEntity.PolicyTypeId,
                PolicyNumber = policyNumber,
                PolicyCode = policyEntity.PolicyCode,
                BrokerCode = policyEntity.BrokerCode,
                RegistrationNo = policyEntity.RegistrationNo,
                StartDate = policyEntity.StartDate,
                EndDate = policyEntity.EndDate,
                RenewalDate = policyEntity.RenewalDate,
                PremiumNet = policyEntity.PremiumNet,
                PremiumGross = policyEntity.PremiumGross,
                PaymentMode = policyEntity.PaymentMode,
                PaymentDueDate = policyEntity.PaymentDueDate,
                PaymentDone = policyEntity.PaymentDone,
                PolicyDocuments = policyEntity.PolicyDocumentRef
            };

            return (responseDto, isUpdate);
        }

        public async Task<object> GetPoliciesAsync(
            string advisorId,
            string role,
            Guid? companyId,
            int pageNumber,
            int pageSize,
            string? search,
            int? policyStatusId,
            int? policyTypeId,
            Guid? customerId,
            Guid? insurerId,
            Guid? productId)
        {
            IQueryable<CustomerPolicy> query = _context.CustomerPolicies
            .AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.Insurer)
            .Include(x => x.Product)
            .Include(x => x.PolicyStatus)
            .Include(x => x.PolicyType);

            if (role == "Advisor")
            {
                query = query.Where(x => x.AdvisorId == advisorId);
            }
            else if (role == "CompanyAdmin" && companyId.HasValue)
            {
                query = query.Where(x => x.CompanyId == companyId);
            }


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
