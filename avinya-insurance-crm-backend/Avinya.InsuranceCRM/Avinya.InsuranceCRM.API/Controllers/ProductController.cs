using Avinya.InsuranceCRM.API.Models;
using Avinya.InsuranceCRM.API.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/products")]
    [Authorize(Policy = "ApprovedAdvisor")]
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

        /* ================= ADD / UPDATE ================= */

        [HttpPost]
        public async Task<IActionResult> UpsertProduct(
            [FromBody] UpsertProductRequest request)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token");

            /* ---------- CREATE ---------- */
            if (!request.ProductId.HasValue || request.ProductId == Guid.Empty)
            {
                var product = new Product
                {
                    ProductId = Guid.NewGuid(),
                    AdvisorId = advisorId,          // 🔐 JWT enforced
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

            /* ---------- UPDATE ---------- */
            var existingProduct = await _productRepository.GetByIdAsync(
                advisorId,
                request.ProductId.Value
            );

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

        /* ================= DROPDOWN ================= */

        [HttpGet("dropdown")]
        public async Task<IActionResult> GetDropdown(
            [FromQuery] Guid? insurerId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token");

            var products = await _productRepository.GetDropdownAsync(
                advisorId,
                insurerId
            );

            return Ok(products.Select(x => new
            {
                x.ProductId,
                x.ProductName
            }));
        }

        /* ================= PAGED LIST ================= */

        [HttpGet]
        public async Task<IActionResult> GetProducts(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] int? productCategoryId = null,
            [FromQuery] string? search = null)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token");

            var result = await _productRepository.GetPagedAsync(
                advisorId,
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

        /* ================= DELETE ================= */

        [HttpDelete("{productId:guid}")]
        public async Task<IActionResult> DeleteProduct(Guid productId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token");

            var deleted = await _productRepository.DeleteAsync(
                advisorId,
                productId
            );

            if (!deleted)
                return NotFound("Product not found or cannot be deleted");

            return Ok(new
            {
                Message = "Product deleted successfully"
            });
        }

        /* ================= PRODUCT CATEGORY DROPDOWN ================= */

        [HttpGet("product-category-dropdown")]
        public async Task<IActionResult> GetProductCategoryDropdown()
        {
            var categories = await _productRepository.GetProductCategoryDropdownAsync();

            return Ok(categories.Select(p => new
            {
                id = p.ProductCategoryId,
                name = p.CategoryName
            }));
        }
    }
}
