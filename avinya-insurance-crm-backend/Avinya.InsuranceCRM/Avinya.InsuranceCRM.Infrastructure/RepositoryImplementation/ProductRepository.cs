using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Product> AddAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> GetByIdAsync(Guid productId)
        {
            return await _context.Products
                .FirstOrDefaultAsync(x => x.ProductId == productId);
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Product>> GetDropdownAsync(Guid? insurerId)
        {
            var query = _context.Products
                .Where(x => x.IsActive)
                .AsQueryable();

            // 🔹 Apply filter ONLY if insurerId is passed
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
        public async Task<PagedRecordResult<Product>> GetPagedAsync( int pageNumber,int pageSize,int? productCategoryId,string? search)
        {
            var query = _context.Products
                .Include(p => p.ProductCategory)
                .AsQueryable();

            // 🎯 Product Category filter
            if (productCategoryId.HasValue)
            {
                query = query.Where(p =>
                    p.ProductCategoryId == productCategoryId.Value);
            }

            // 🔍 Search filter (ProductName, ProductCode, CommissionRules)
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
        public async Task<bool> DeleteAsync(Guid productId)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(x => x.ProductId == productId);

            if (product == null)
                return false;

            // 🚫 Business rule: Do not delete if used in policies
            var isUsed = await _context.CustomerPolicies
                .AnyAsync(p => p.ProductId == productId);

            if (isUsed)
                return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<List<ProductCategory>> GetProductCategoryDropdownAsync()
        {
            var query = _context.ProductCategories
                .Where(x => x.IsActive)
                .AsQueryable();
            return await query
                .OrderBy(x => x.CategoryName)
                .ToListAsync();
        }

    }
}
