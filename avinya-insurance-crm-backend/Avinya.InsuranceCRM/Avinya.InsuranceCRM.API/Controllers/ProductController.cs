using Avinya.InsuranceCRM.Application.DTOs.Product;
using Avinya.InsuranceCRM.Application.Interfaces.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/products")]
    [Authorize(Policy = "ApprovedAdvisorOrCompanyAdmin")]
    public class ProductController : ControllerBase
    {
        private readonly IProductServices _service;

        public ProductController(IProductServices service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrUpdate(
            UpsertProductRequest request)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var companyIdClaim = User.FindFirstValue("CompanyId");

            Guid? companyId = Guid.TryParse(companyIdClaim, out var cid)
                ? cid
                : null;

            var response =
                await _service.CreateOrUpdateAsync(advisorId, companyId, request);

            return StatusCode(response.StatusCode, response);
        }

        [HttpGet]
        public async Task<IActionResult> GetPaged(
            int pageNumber = 1,
            int pageSize = 10,
            int? productCategoryId = null,
            string? search = null)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);
            var companyIdClaim = User.FindFirstValue("CompanyId");

            Guid? companyId = Guid.TryParse(companyIdClaim, out var cid)
                ? cid
                : null;

            var response =
                await _service.GetPagedAsync(
                    advisorId, role, companyId, pageNumber, pageSize, productCategoryId, search);

            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{productId:guid}")]
        public async Task<IActionResult> Delete(Guid productId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.DeleteAsync(advisorId, productId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("dropdown")]
        public async Task<IActionResult> Dropdown(Guid? insurerId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);
            var companyIdClaim = User.FindFirstValue("CompanyId");

            Guid? companyId = Guid.TryParse(companyIdClaim, out var cid)
                ? cid
                : null;

            var response = await _service.GetDropdownAsync(advisorId, role, companyId, insurerId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("product-category-dropdown")]
        public async Task<IActionResult> CategoryDropdown()
        {
            var response = await _service.GetCategoryDropdownAsync();
            return StatusCode(response.StatusCode, response);
        }
    }
}
