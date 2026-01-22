using Avinya.InsuranceCRM.Application.DTOs.CustomerPolicy;
using Avinya.InsuranceCRM.Application.Interfaces.CustomerPolicy;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System.Security.Claims;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/policy")]
    [Authorize(Policy = "ApprovedAdvisorOrCompanyAdmin")]
    public class PolicyController : ControllerBase
    {
        private readonly ICustomerPolicyServices _service;

        public PolicyController(ICustomerPolicyServices service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetPolicies(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null,
            int? policyStatusId = null,
            int? policyTypeId = null,
            Guid? customerId = null,
            Guid? insurerId = null,
            Guid? productId = null)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.GetPoliciesAsync(
                advisorId,
                pageNumber,
                pageSize,
                search,
                policyStatusId,
                policyTypeId,
                customerId,
                insurerId,
                productId);

            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("upsert")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upsert([FromForm] UpsertPolicyRequest request)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var companyIdClaim = User.FindFirstValue("CompanyId");
            Guid? companyId = null;
            if (Guid.TryParse(companyIdClaim, out var parsedCompanyId))
                companyId = parsedCompanyId;

            var response = await _service.CreateOrUpdateAsync(
                advisorId,
                companyId,
                request);

            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{policyId:guid}")]
        public async Task<IActionResult> Delete(Guid policyId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.DeleteAsync(advisorId, policyId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{policyId:guid}/documents/{documentId}")]
        public async Task<IActionResult> DeleteDocument(
            Guid policyId,
            string documentId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.DeleteDocumentAsync(advisorId, policyId, documentId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{policyId:guid}/documents/{documentId}/preview")]
        public IActionResult Preview(Guid policyId, string documentId)
            => _service.PreviewDocument(policyId, documentId);

        [HttpGet("{policyId:guid}/documents/{documentId}/download")]
        public IActionResult Download(Guid policyId, string documentId)
            => _service.DownloadDocument(policyId, documentId);

        [HttpGet("policy-types-dropdown")]
        public async Task<IActionResult> PolicyTypes()
            => StatusCode(200, await _service.GetPolicyTypesAsync());

        [HttpGet("policy-statuses-dropdown")]
        public async Task<IActionResult> PolicyStatuses()
            => StatusCode(200, await _service.GetPolicyStatusesAsync());

        [HttpGet("policy-dropdown")]
        public async Task<IActionResult> PolicyDropdown(Guid? customerId = null)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.GetDropdownAsync(advisorId, customerId);
            return StatusCode(response.StatusCode, response);
        }
    }
}
