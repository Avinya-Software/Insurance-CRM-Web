using Avinya.InsuranceCRM.Application.Interfaces.Claim;
using Avinya.InsuranceCRM.Application.RequestModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/claim")]
    [Authorize(Policy = "ApprovedAdvisorOrCompanyAdmin")]
    public class ClaimController : ControllerBase
    {
        private readonly IClaimServices _service;

        public ClaimController(IClaimServices service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrUpdate(
        [FromBody] UpsertClaimRequest request)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var companyIdClaim = User.FindFirstValue("CompanyId");
            Guid? companyId = Guid.TryParse(companyIdClaim, out var cid) ? cid : null;

            var response = await _service.CreateOrUpdateAsync(
                advisorId,
                companyId,
                request);

            return StatusCode(response.StatusCode, response);
        }

        [HttpGet]
        public async Task<IActionResult> GetPaged(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null,
            Guid? customerId = null,
            Guid? policyId = null,
            int? claimTypeId = null,
            int? claimStageId = null,
            int? claimHandlerId = null,
            string? status = null)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.GetPagedAsync(
                advisorId, pageNumber, pageSize, search,
                customerId, policyId, claimTypeId,
                claimStageId, claimHandlerId, status);

            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{claimId:guid}")]
        public async Task<IActionResult> Delete(Guid claimId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.DeleteAsync(advisorId, claimId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPatch("{claimId:guid}/stage/{stageId:int}")]
        public async Task<IActionResult> UpdateStage(
            Guid claimId, int stageId, string? notes)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.UpdateStageAsync(advisorId, claimId, stageId, notes);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{claimId:guid}/documents/{documentId}")]
        public async Task<IActionResult> DeleteDocument(Guid claimId, string documentId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _service.DeleteDocumentAsync(advisorId, claimId, documentId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{claimId:guid}/documents/{documentId}/preview")]
        public async Task<IActionResult> Preview(Guid claimId, string documentId)
        {
            var response = await _service.PreviewDocument(claimId, documentId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{claimId:guid}/documents/{documentId}/download")]
        public async Task<IActionResult> Download(Guid claimId, string documentId)
        {
            var response = await _service.DownloadDocument(claimId, documentId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("claim-types")]
        public async Task<IActionResult> GetClaimTypes()
        {
            var response = await _service.GetClaimTypesAsync();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("claim-stages")]
        public async Task<IActionResult> GetClaimStages()
        {
            var response = await _service.GetClaimTypesAsync();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("claim-handlers")]        
        public async Task<IActionResult> GetClaimHandlers()
        {
            var response = await _service.GetClaimTypesAsync();
            return StatusCode(response.StatusCode, response);
        }
    }
}
