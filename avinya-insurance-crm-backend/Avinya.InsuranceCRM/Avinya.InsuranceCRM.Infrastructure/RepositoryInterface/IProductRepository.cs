using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface IProductRepository
    {
        Task<Product> AddAsync(Product product);
        Task<Product?> GetByIdAsync(Guid productId);
        Task UpdateAsync(Product product);
        Task<List<Product>> GetDropdownAsync(Guid? insurerId);
        Task<PagedRecordResult<Product>> GetPagedAsync(int pageNumber,int pageSize,int? productCategoryId,string? search);
        Task<bool> DeleteAsync(Guid productId);
        Task<List<ProductCategory>> GetProductCategoryDropdownAsync();

    }
}
