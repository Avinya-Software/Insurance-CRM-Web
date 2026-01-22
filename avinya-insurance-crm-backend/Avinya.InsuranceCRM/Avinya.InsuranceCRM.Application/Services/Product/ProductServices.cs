using Avinya.InsuranceCRM.Application.DTOs.Product;
using Avinya.InsuranceCRM.Application.Interfaces.Product;
using Avinya.InsuranceCRM.Application.RepositoryInterface;

using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Services.Product
{
    public class ProductServices : IProductServices
    {
        private readonly IProductRepository _repo;

        public ProductServices(IProductRepository repo)
        {
            _repo = repo;
        }

        public async Task<ResponseModel> CreateOrUpdateAsync(
        string advisorId,
        Guid? companyId,
        UpsertProductRequest request)
            {
                if (string.IsNullOrEmpty(advisorId))
                    return new ResponseModel(401, "Invalid advisor token");

                var (productId, isUpdate) =
                    await _repo.CreateOrUpdateAsync(advisorId, companyId, request);

                return new ResponseModel(
                    200,
                    isUpdate
                        ? "Product updated successfully"
                        : "Product created successfully",
                    new { ProductId = productId }
            );
        }


        public async Task<ResponseModel> GetPagedAsync(
            string advisorId,
            string role,
            Guid? companyId,
            int pageNumber,
            int pageSize,
            int? productCategoryId,
            string? search)
        {
            var (data, totalCount) =
                await _repo.GetPagedAsync(
                    advisorId, role , companyId, pageNumber, pageSize, productCategoryId, search);

            return new ResponseModel(200, "Products fetched successfully", new
            {
                TotalCount = totalCount,
                Page = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                Data = data
            });
        }


        public async Task<ResponseModel> DeleteAsync(string advisorId, Guid productId)
            => await _repo.DeleteAsync(advisorId, productId)
                ? new ResponseModel(200, "Product deleted successfully")
                : new ResponseModel(404, "Product not found");

        public async Task<ResponseModel> GetDropdownAsync(
            string advisorId,
            string role,
            Guid? companyId,
            Guid? insurerId)
            => new ResponseModel(
                200,
                "Dropdown fetched successfully",
                await _repo.GetDropdownAsync(advisorId, role, companyId, insurerId));

        public async Task<ResponseModel> GetCategoryDropdownAsync()
            => new ResponseModel(
                200,
                "Categories fetched successfully",
                await _repo.GetCategoryDropdownAsync());
    }
}
