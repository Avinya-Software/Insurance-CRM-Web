using Avinya.InsuranceCRM.Application.DTOs.Product;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Interfaces.Product
{
    public interface IProductServices
    {
        Task<ResponseModel> CreateOrUpdateAsync(
            string advisorId,
            Guid? companyId,
            UpsertProductRequest request);

        Task<ResponseModel> GetPagedAsync(
            string advisorId,
            string role,
            Guid? companyId,
            int pageNumber,
            int pageSize,
            int? productCategoryId,
            string? search);

        Task<ResponseModel> DeleteAsync(string advisorId, Guid productId);

        Task<ResponseModel> GetDropdownAsync(string advisorId, string role, Guid? companyId, Guid? insurerId);

        Task<ResponseModel> GetCategoryDropdownAsync();

    }
}
