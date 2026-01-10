using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface IProductRepository
    {
        /* ================= CREATE / UPDATE ================= */

        Task<Product> AddAsync(Product product);
        Task UpdateAsync(Product product);

        /* ================= READ ================= */

        Task<Product?> GetByIdAsync(
            string advisorId,
            Guid productId
        );

        Task<PagedRecordResult<Product>> GetPagedAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            int? productCategoryId,
            string? search
        );

        Task<List<Product>> GetDropdownAsync(
            string advisorId,
            Guid? insurerId
        );

        Task<List<ProductCategory>> GetProductCategoryDropdownAsync();

        /* ================= DELETE ================= */

        Task<bool> DeleteAsync(
            string advisorId,
            Guid productId
        );
    }
}
