using Avinya.InsuranceCRM.Application.Interfaces.Customer;
using Avinya.InsuranceCRM.Application.RequestModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "ApprovedAdvisorOrCompanyAdmin")]
    public class CustomerController : ControllerBase
    {

        private readonly ICustomerServices _service;

        public CustomerController(ICustomerServices service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrUpdateCustomer(
            [FromForm] CreateCustomerRequest request)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.CreateOrUpdateAsync(advisorId, request);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCustomers(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.GetPagedAsync(advisorId, pageNumber, pageSize, search);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{customerId:guid}")]
        public async Task<IActionResult> DeleteCustomer(Guid customerId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.DeleteAsync(advisorId, customerId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{customerId:guid}/kyc/{documentId}")]
        public async Task<IActionResult> DeleteKycFile(
            Guid customerId,
            string documentId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.DeleteKycAsync(advisorId, customerId, documentId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("dropdown")]
        public async Task<IActionResult> GetCustomerDropdown()
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.GetDropdownAsync(advisorId);
            return StatusCode(response.StatusCode, response);
        }


        [HttpGet("{customerId:guid}/kyc/{documentId}/preview")]
        public IActionResult PreviewKyc(Guid customerId, string documentId)
        {
            return _service.PreviewKyc(customerId, documentId);
        }

        [HttpGet("{customerId:guid}/kyc/{documentId}/download")]
        public IActionResult DownloadKyc(Guid customerId, string documentId)
        {
            return _service.DownloadKyc(customerId, documentId);
        }

    }
}
