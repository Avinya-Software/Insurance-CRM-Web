using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class CustomerPolicyRepository : ICustomerPolicyRepository
    {
        private readonly AppDbContext _context;

        public CustomerPolicyRepository(AppDbContext context)
        {
            _context = context;
        }

        /* ================= UPSERT ================= */

        public async Task<CustomerPolicy> UpsertAsync(
            CustomerPolicy policy,
            string advisorId)
        {
            var entity = await _context.CustomerPolicies
                .FirstOrDefaultAsync(x =>
                    x.PolicyId == policy.PolicyId &&
                    x.AdvisorId == advisorId
                );

            /* ================= CREATE ================= */
            if (entity == null)
            {
                entity = new CustomerPolicy
                {
                    PolicyId = policy.PolicyId == Guid.Empty
                        ? Guid.NewGuid()
                        : policy.PolicyId,

                    AdvisorId = advisorId,
                    CreatedAt = DateTime.UtcNow,

                    // ✅ GENERATED ONLY ONCE
                    PolicyNumber = await GeneratePolicyNumberAsync(advisorId)
                };

                _context.CustomerPolicies.Add(entity);
            }
            /* ================= UPDATE ================= */
            else
            {
                entity.UpdatedAt = DateTime.UtcNow;
                // ❌ DO NOT TOUCH PolicyNumber
            }

            /* ================= COMMON FIELDS ================= */
            entity.CustomerId = policy.CustomerId;
            entity.InsurerId = policy.InsurerId;
            entity.ProductId = policy.ProductId;
            entity.PolicyStatusId = policy.PolicyStatusId;
            entity.PolicyTypeId = policy.PolicyTypeId;
            entity.RegistrationNo = policy.RegistrationNo;
            entity.StartDate = policy.StartDate;
            entity.EndDate = policy.EndDate;
            entity.PremiumNet = policy.PremiumNet;
            entity.PremiumGross = policy.PremiumGross;
            entity.PaymentMode = policy.PaymentMode;
            entity.PaymentDueDate = policy.PaymentDueDate;
            entity.RenewalDate = policy.RenewalDate;
            entity.BrokerCode = policy.BrokerCode;
            entity.PolicyCode = policy.PolicyCode;

            /* ================= DOCUMENT UPDATE (APPEND MODE) ================= */
            if (!string.IsNullOrWhiteSpace(policy.PolicyDocumentRef))
            {
                if (string.IsNullOrWhiteSpace(entity.PolicyDocumentRef))
                {
                    entity.PolicyDocumentRef = policy.PolicyDocumentRef;
                }
                else
                {
                    var existingFiles = entity.PolicyDocumentRef
                        .Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(f => f.Trim())
                        .ToList();

                    var newFiles = policy.PolicyDocumentRef
                        .Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(f => f.Trim())
                        .ToList();

                    var allFiles = existingFiles.Union(newFiles).ToList();
                    entity.PolicyDocumentRef = string.Join(",", allFiles);
                }
            }

            await _context.SaveChangesAsync();
            return entity;
        }

        /* ================= GET POLICIES ================= */

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
            {
                query = query.Where(x =>
                    x.PolicyNumber.Contains(search) ||
                    x.RegistrationNo.Contains(search) ||
                    x.CustomerId.ToString().Contains(search));
            }

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

            var policies = await query
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
                    x.BrokerCode,
                    x.PolicyCode,
                    x.PaymentDueDate,
                    x.PaymentMode,
                    x.RenewalDate,
                    x.PolicyStatusId,
                    x.PolicyTypeId,
                    x.CustomerId,
                    x.InsurerId,
                    x.ProductId,

                    PolicyStatusName = x.PolicyStatus.StatusName,
                    PolicyTypeName = x.PolicyType.TypeName,

                    CustomerName = x.Customer.FullName,
                    CustomerEmail = x.Customer.Email,

                    InsurerName = x.Insurer.InsurerName,
                    ProductName = x.Product.ProductName,

                    x.PolicyDocumentRef,
                    x.CreatedAt
                })
                .ToListAsync();

            return new
            {
                totalRecords,
                pageNumber,
                pageSize,
                totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize),
                data = policies
            };
        }

        /* ================= GET POLICY BY ID ================= */

        public async Task<CustomerPolicy?> GetByIdAsync(
            string advisorId,
            Guid policyId)
        {
            return await _context.CustomerPolicies
                .FirstOrDefaultAsync(x =>
                    x.PolicyId == policyId &&
                    x.AdvisorId == advisorId);
        }

        /* ================= DELETE POLICY ================= */

        public async Task DeleteByIdAsync(
            string advisorId,
            Guid policyId)
        {
            var policy = await _context.CustomerPolicies
                .FirstOrDefaultAsync(x =>
                    x.PolicyId == policyId &&
                    x.AdvisorId == advisorId);

            if (policy == null)
                return;

            _context.CustomerPolicies.Remove(policy);
            await _context.SaveChangesAsync();
        }

        /* ================= POLICY NUMBER GENERATOR ================= */

        private async Task<string> GeneratePolicyNumberAsync(string advisorId)
        {
            var lastPolicy = await _context.CustomerPolicies
                .Where(x => x.AdvisorId == advisorId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => x.PolicyNumber)
                .FirstOrDefaultAsync();

            int nextNumber = 1;

            if (!string.IsNullOrWhiteSpace(lastPolicy))
            {
                var parts = lastPolicy.Split('-');
                if (parts.Length == 2 &&
                    int.TryParse(parts[1], out var last))
                {
                    nextNumber = last + 1;
                }
            }

            return $"POL-{nextNumber:D6}";
        }

        /* ================= DROPDOWNS ================= */

        public async Task<List<PolicyTypeMaster>> GetPolicyTypesAsync()
        {
            return await _context.PolicyTypes
                .Where(x => x.IsActive)
                .OrderBy(x => x.TypeName)
                .ToListAsync();
        }

        public async Task<List<PolicyStatusMaster>> GetPolicyStatusesAsync()
        {
            return await _context.PolicyStatuses
                .Where(x => x.IsActive)
                .OrderBy(x => x.StatusName)
                .ToListAsync();
        }

        public async Task<List<CustomerPolicy>> GetPoliciesForDropdownAsync(
     string advisorId,
     Guid? customerId
 )
        {
            var query = _context.CustomerPolicies
                .AsNoTracking()
                .Where(x => x.AdvisorId == advisorId);

            // 🔥 FILTER ONLY WHEN customerId IS PROVIDED
            if (customerId.HasValue)
            {
                query = query.Where(x => x.CustomerId == customerId.Value);
            }

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


    }
}
