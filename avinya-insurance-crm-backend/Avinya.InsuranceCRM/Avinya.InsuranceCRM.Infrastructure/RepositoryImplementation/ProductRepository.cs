using Avinya.InsuranceCRM.Application.DTOs.Product;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(Guid productId, bool isUpdate)> CreateOrUpdateAsync(
            string advisorId,
            Guid? companyId,
            UpsertProductRequest request)
        {
            if (request.ProductId.HasValue)
            {
                var product = await _context.Products.FirstOrDefaultAsync(x =>
                    x.ProductId == request.ProductId &&
                    x.AdvisorId == advisorId);

                if (product == null)
                    throw new KeyNotFoundException("Product not found");

                product.ProductName = request.ProductName;
                product.ProductCode = request.ProductCode;
                product.ProductCategoryId = request.ProductCategoryId;
                product.DefaultReminderDays = request.DefaultReminderDays;
                product.CommissionRules = request.CommissionRules;
                product.IsActive = request.IsActive;
                product.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return (product.ProductId, true);
            }

            var newProduct = new Product
            {
                ProductId = Guid.NewGuid(),
                AdvisorId = advisorId,
                CompanyId = companyId,
                InsurerId = request.InsurerId,
                ProductCategoryId = request.ProductCategoryId,
                ProductName = request.ProductName,
                ProductCode = request.ProductCode,
                DefaultReminderDays = request.DefaultReminderDays,
                CommissionRules = request.CommissionRules,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(newProduct);
            await _context.SaveChangesAsync();

            return (newProduct.ProductId, false);
        }

        public async Task<(IEnumerable<ProductListDto>, int)> GetPagedAsync(
            string advisorId,
            string role,
            Guid? companyId,
            int pageNumber,
            int pageSize,
            int? productCategoryId,
            string? search)
        {
            IQueryable<Product> baseQuery = _context.Products
                .Include(x => x.ProductCategory)
                .AsNoTracking();

            if (role == "Advisor")
            {
                baseQuery = baseQuery.Where(x => x.AdvisorId == advisorId);
            }
            else if (role == "CompanyAdmin" && companyId.HasValue)
            {
                baseQuery = baseQuery.Where(x => x.CompanyId == companyId);
            }


            if (productCategoryId.HasValue)
                baseQuery = baseQuery.Where(x => x.ProductCategoryId == productCategoryId);

            if (!string.IsNullOrWhiteSpace(search))
                baseQuery = baseQuery.Where(x =>
                    x.ProductName.Contains(search) ||
                    x.ProductCode.Contains(search));

            var totalCount = await baseQuery.CountAsync();

            var data = await baseQuery
                .OrderByDescending(x => x.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new ProductListDto
                {
                    ProductId = x.ProductId,
                    InsurerId = x.InsurerId,
                    ProductName = x.ProductName,
                    ProductCode = x.ProductCode,
                    ProductCategoryId = x.ProductCategoryId,
                    ProductCategoryName = x.ProductCategory.CategoryName,
                    DefaultReminderDays = x.DefaultReminderDays,
                    IsActive = x.IsActive,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();

            return (data, totalCount);
        }


        public async Task<bool> DeleteAsync(string advisorId, Guid productId)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(x =>
                    x.ProductId == productId &&
                    x.AdvisorId == advisorId);

            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<ProductDropdownDto>> GetDropdownAsync(
            string advisorId,
            string role,
            Guid? companyId,
            Guid? insurerId)
        {
            IQueryable<Product> query = _context.Products
                .AsNoTracking()
                .Where(x => x.IsActive);

            if (role == "Advisor")
            {
                query = query.Where(x => x.AdvisorId == advisorId);
            }
            else if (role == "CompanyAdmin" && companyId.HasValue)
            {
                query = query.Where(x => x.CompanyId == companyId);
            }

            if (insurerId.HasValue)
                query = query.Where(x => x.InsurerId == insurerId);

            return await query
            .OrderBy(x => x.ProductName)
            .Select(x => new ProductDropdownDto
            {
                ProductId = x.ProductId,
                ProductName = x.ProductName
            })
            .ToListAsync();
        }

        public async Task<List<object>> GetCategoryDropdownAsync()
            => await _context.ProductCategories
                .Where(x => x.IsActive)
                .Select(x => new
                {
                    x.ProductCategoryId,
                    x.CategoryName
                })
                .Cast<object>()
                .ToListAsync();
    }
}
