using Avinya.InsuranceCRM.API.Models;
using Avinya.InsuranceCRM.API.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/products")]
	[Authorize]
	public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepository; 
        private readonly ILogger<ProductController> _logger;

        public ProductController(
            IProductRepository productRepository,
            ILogger<ProductController> logger)
        {
            _productRepository = productRepository;
            _logger = logger;
        }

        // 🔥 ADD / UPDATE PRODUCT
        [HttpPost]
        public async Task<IActionResult> UpsertProduct(
            [FromBody] UpsertProductRequest request)
        {
            // ---------------- ADD ----------------
            if (request.ProductId == null || request.ProductId == Guid.Empty)
            {
                var product = new Product
                {
                    ProductId = Guid.NewGuid(),
                    InsurerId = request.InsurerId,
                    ProductCategoryId = request.ProductCategoryId,
                    ProductName = request.ProductName,
                    ProductCode = request.ProductCode,
                    DefaultReminderDays = request.DefaultReminderDays,
                    CommissionRules = request.CommissionRules,
                    IsActive = request.IsActive,
                    CreatedAt = DateTime.UtcNow
                };

                await _productRepository.AddAsync(product);

                return Ok(new
                {
                    Message = "Product created successfully",
                    ProductId = product.ProductId
                });
            }

            // ---------------- UPDATE ----------------
            var existingProduct = await _productRepository.GetByIdAsync(request.ProductId.Value);

            if (existingProduct == null)
                return NotFound("Product not found");

            existingProduct.ProductName = request.ProductName;
            existingProduct.ProductCode = request.ProductCode;
            existingProduct.ProductCategoryId = request.ProductCategoryId;
            existingProduct.DefaultReminderDays = request.DefaultReminderDays;
            existingProduct.CommissionRules = request.CommissionRules;
            existingProduct.IsActive = request.IsActive;
            existingProduct.UpdatedAt = DateTime.UtcNow;

            await _productRepository.UpdateAsync(existingProduct);

            return Ok(new
            {
                Message = "Product updated successfully",
                ProductId = existingProduct.ProductId
            });
        }
        [HttpGet("dropdown")]
        public async Task<IActionResult> GetDropdown([FromQuery] Guid? insurerId)
        {
            var products = await _productRepository.GetDropdownAsync(insurerId);

            return Ok(products.Select(x => new
            {
                x.ProductId,
                x.ProductName
            }));
        }
        [HttpGet]
        public async Task<IActionResult> GetProducts(
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 10,

    // 🎯 Filters
    [FromQuery] int? productCategoryId = null,
    [FromQuery] string? search = null
)
        {
            var result = await _productRepository.GetPagedAsync(
                pageNumber,
                pageSize,
                productCategoryId,
                search
            );

            return Ok(ApiResponse<object>.Success(new
            {
                result.TotalRecords,
                result.PageNumber,
                result.PageSize,
                TotalPages = (int)Math.Ceiling(
                    result.TotalRecords / (double)pageSize
                ),
                Products = result.Data.Select(p => new
                {
                    p.ProductId,
                    p.ProductName,
                    p.ProductCode,
                    ProductCategory = p.ProductCategory.CategoryName,
                    p.DefaultReminderDays,
                    p.InsurerId,
                    p.CommissionRules,
                    p.IsActive,
                    p.CreatedAt
                })
            }, "Products fetched successfully"));
        }
        // ---------- DELETE PRODUCT ----------
        [HttpDelete("{productId:guid}")]
        public async Task<IActionResult> DeleteProduct(Guid productId)
        {
            var deleted = await _productRepository.DeleteAsync(productId);

            if (!deleted)
                return NotFound("Product not found or cannot be deleted");

            return Ok(new
            {
                Message = "Product deleted successfully"
            });
        }
        [HttpGet("ProductCategorydropdown")]
        public async Task<IActionResult> GetProductDropdown()
        {
            var products = await _productRepository.GetProductCategoryDropdownAsync();

            return Ok(products.Select(p => new
            {
                id = p.ProductCategoryId,
                name = p.CategoryName
            }));
        }
    }
}
