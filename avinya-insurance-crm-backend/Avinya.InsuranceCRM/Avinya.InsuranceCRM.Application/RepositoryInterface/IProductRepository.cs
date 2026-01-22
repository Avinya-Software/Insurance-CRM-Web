using Avinya.InsuranceCRM.Application.DTOs.Product;
using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface IProductRepository
    {
        Task<(Guid productId, bool isUpdate)> CreateOrUpdateAsync(
            string advisorId,
            Guid? companyId,
            UpsertProductRequest request);

        Task<(IEnumerable<ProductListDto> Data, int TotalCount)> GetPagedAsync(
            string advisorId,
            string role,
            Guid? companyId,
            int pageNumber,
            int pageSize,
            int? productCategoryId,
            string? search);

        Task<bool> DeleteAsync(string advisorId, Guid productId);

        Task<List<ProductDropdownDto>> GetDropdownAsync(
            string advisorId,
             string role,
            Guid? companyId,
            Guid? insurerId);

        Task<List<object>> GetCategoryDropdownAsync();
    }
}
