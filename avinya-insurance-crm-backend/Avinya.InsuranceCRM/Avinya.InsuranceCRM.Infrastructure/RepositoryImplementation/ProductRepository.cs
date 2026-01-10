using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        /* ================= CREATE ================= */

        public async Task<Product> AddAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        /* ================= READ ================= */

        public async Task<Product?> GetByIdAsync(
            string advisorId,
            Guid productId)
        {
            return await _context.Products
                .Include(x => x.ProductCategory)
                .FirstOrDefaultAsync(x =>
                    x.ProductId == productId &&
                    x.AdvisorId == advisorId);
        }

        public async Task<PagedRecordResult<Product>> GetPagedAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            int? productCategoryId,
            string? search)
        {
            var query = _context.Products
                .Include(p => p.ProductCategory)
                .Where(p => p.AdvisorId == advisorId)
                .AsQueryable();

            /* -------- CATEGORY FILTER -------- */
            if (productCategoryId.HasValue)
            {
                query = query.Where(p =>
                    p.ProductCategoryId == productCategoryId.Value);
            }

            /* -------- SEARCH FILTER -------- */
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();

                query = query.Where(p =>
                    p.ProductName.ToLower().Contains(search) ||
                    p.ProductCode.ToLower().Contains(search) ||
                    (p.CommissionRules != null &&
                     p.CommissionRules.ToLower().Contains(search))
                );
            }

            var totalRecords = await query.CountAsync();

            var products = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedRecordResult<Product>
            {
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Data = products
            };
        }

        public async Task<List<Product>> GetDropdownAsync(
            string advisorId,
            Guid? insurerId)
        {
            var query = _context.Products
                .Where(x =>
                    x.AdvisorId == advisorId &&
                    x.IsActive)
                .AsQueryable();

            if (insurerId.HasValue && insurerId != Guid.Empty)
            {
                query = query.Where(x => x.InsurerId == insurerId.Value);
            }

            return await query
                .OrderBy(x => x.ProductName)
                .Select(x => new Product
                {
                    ProductId = x.ProductId,
                    ProductName = x.ProductName
                })
                .ToListAsync();
        }

        /* ================= UPDATE ================= */

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        /* ================= DELETE ================= */

        public async Task<bool> DeleteAsync(
            string advisorId,
            Guid productId)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(x =>
                    x.ProductId == productId &&
                    x.AdvisorId == advisorId);

            if (product == null)
                return false;

            // 🚫 Do not delete if used in policies (advisor-safe)
            var isUsed = await _context.CustomerPolicies
                .AnyAsync(p =>
                    p.ProductId == productId &&
                    p.AdvisorId == advisorId);

            if (isUsed)
                return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return true;
        }

        /* ================= DROPDOWNS ================= */

        public async Task<List<ProductCategory>> GetProductCategoryDropdownAsync()
        {
            return await _context.ProductCategories
                .Where(x => x.IsActive)
                .OrderBy(x => x.CategoryName)
                .ToListAsync();
        }
    }
}
