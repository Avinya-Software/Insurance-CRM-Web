using Avinya.InsuranceCRM.API.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System.Security.Claims;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/policy")]
    [Authorize]
    public class PolicyController : ControllerBase
    {
        private readonly ICustomerPolicyRepository _policyRepository;
        private readonly IWebHostEnvironment _env;

        public PolicyController(
            ICustomerPolicyRepository policyRepository,
            IWebHostEnvironment env)
        {
            _policyRepository = policyRepository;
            _env = env;
        }

        /* ================= GET POLICIES ================= */

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

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token.");

            var result = await _policyRepository.GetPoliciesAsync(
                advisorId,
                pageNumber,
                pageSize,
                search,
                policyStatusId,
                policyTypeId,
                customerId,
                insurerId,
                productId
            );

            return Ok(result);
        }

        /* ================= UPSERT POLICY ================= */

        [HttpPost("upsert")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpsertPolicy(
            [FromForm] UpsertPolicyRequest request)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token.");

            var policyId = request.PolicyId ?? Guid.NewGuid();

            var policy = new CustomerPolicy
            {
                PolicyId = policyId,
                CustomerId = request.CustomerId,
                InsurerId = request.InsurerId,
                ProductId = request.ProductId,
                PolicyStatusId = request.PolicyStatusId,
                PolicyTypeId = request.PolicyTypeId,
                RegistrationNo = request.RegistrationNo,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                PremiumNet = request.PremiumNet,
                PremiumGross = request.PremiumGross,
                PaymentMode = request.PaymentMode,
                PaymentDueDate = request.PaymentDueDate,
                RenewalDate = request.RenewalDate,
                BrokerCode = request.BrokerCode,
                PolicyCode = request.PolicyCode
            };

            /* -------- POLICY DOCUMENT UPLOAD -------- */
            if (request.PolicyDocuments != null && request.PolicyDocuments.Any())
            {
                var uploadRoot = Path.Combine(
                    _env.ContentRootPath,
                    "Uploads",
                    "Policies",
                    policyId.ToString()
                );

                Directory.CreateDirectory(uploadRoot);

                var savedFiles = new List<string>();

                foreach (var file in request.PolicyDocuments)
                {
                    if (file.Length == 0) continue;

                    var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                    var filePath = Path.Combine(uploadRoot, fileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);

                    savedFiles.Add(fileName);
                }

                policy.PolicyDocumentRef = string.Join(",", savedFiles);
            }

            var result = await _policyRepository.UpsertAsync(policy, advisorId);

            return Ok(new
            {
                result.PolicyId,
                Message = request.PolicyId.HasValue
                    ? "Policy updated successfully"
                    : "Policy created successfully"
            });
        }

        /* ================= POLICY DOCUMENT PREVIEW ================= */

        [HttpGet("{policyId:guid}/documents/{documentId}/preview")]
        public IActionResult PreviewPolicyDocument(Guid policyId, string documentId)
        {
            var filePath = FindPolicyDocument(policyId, documentId);
            if (filePath == null) return NotFound();

            var contentType = GetContentType(filePath);

            return PhysicalFile(
                filePath,
                contentType,
                enableRangeProcessing: true
            );
        }

        /* ================= POLICY DOCUMENT DOWNLOAD ================= */

        [HttpGet("{policyId:guid}/documents/{documentId}/download")]
        public IActionResult DownloadPolicyDocument(Guid policyId, string documentId)
        {
            var filePath = FindPolicyDocument(policyId, documentId);
            if (filePath == null) return NotFound();

            var contentType = GetContentType(filePath);
            var fileName = Path.GetFileName(filePath);

            return PhysicalFile(filePath, contentType, fileName);
        }

        /* ================= POLICY DOCUMENT DELETE ================= */

        [HttpDelete("{policyId:guid}/documents/{documentId}")]
        public async Task<IActionResult> DeletePolicyDocument(
            Guid policyId,
            string documentId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token.");

            var policy = await _policyRepository.GetByIdAsync(policyId);

            if (policy == null)
                return NotFound("Policy not found");

            if (string.IsNullOrWhiteSpace(policy.PolicyDocumentRef))
                return BadRequest("No documents found");

            var files = policy.PolicyDocumentRef
                .Split(",", StringSplitOptions.RemoveEmptyEntries)
                .ToList();

            var fileName = files.FirstOrDefault(f =>
                f.StartsWith(documentId + "_"));

            if (fileName == null)
                return NotFound("Document not found");

            var filePath = Path.Combine(
                _env.ContentRootPath,
                "Uploads",
                "Policies",
                policyId.ToString(),
                fileName
            );

            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);

            files.Remove(fileName);
            policy.PolicyDocumentRef = files.Any()
                ? string.Join(",", files)
                : null;

            await _policyRepository.UpsertAsync(policy, advisorId);

            return Ok("Policy document deleted successfully");
        }
        /* ================= DELETE POLICY ================= */

        [HttpDelete("{policyId:guid}")]
        public async Task<IActionResult> DeletePolicy(Guid policyId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token.");

            var policy = await _policyRepository.GetByIdAsync(policyId);

            if (policy == null)
                return NotFound("Policy not found");

            if (policy.AdvisorId != advisorId)
                return Forbid();

            /* -------- DELETE POLICY DOCUMENTS -------- */
            var policyFolder = Path.Combine(
                _env.ContentRootPath,
                "Uploads",
                "Policies",
                policyId.ToString()
            );

            if (Directory.Exists(policyFolder))
            {
                Directory.Delete(policyFolder, recursive: true);
            }

            /* -------- DELETE POLICY FROM DB -------- */
            await _policyRepository.DeleteByIdAsync(policyId, advisorId);

            return Ok("Policy deleted successfully");
        }

        /* ================= DROPDOWNS ================= */

        [HttpGet("policy-types-dropdown")]
        public async Task<IActionResult> GetPolicyTypesDropdown()
        {
            var types = await _policyRepository.GetPolicyTypesAsync();

            return Ok(types.Select(x => new
            {
                id = x.PolicyTypeId,
                name = x.TypeName
            }));
        }

        [HttpGet("policy-statuses-dropdown")]
        public async Task<IActionResult> GetPolicyStatusesDropdown()
        {
            var statuses = await _policyRepository.GetPolicyStatusesAsync();

            return Ok(statuses.Select(x => new
            {
                id = x.PolicyStatusId,
                name = x.StatusName
            }));
        }
        /* ================= POLICY DROPDOWN ================= */

        [HttpGet("policy-dropdown")]
        public async Task<IActionResult> GetPolicyDropdown()
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token.");

            var policies = await _policyRepository.GetPoliciesForDropdownAsync(advisorId);

            return Ok(policies.Select(x => new
            {
                id = x.PolicyId,
                policyNumber = x.PolicyNumber,
                policyCode = x.PolicyCode
            }));
        }

        /* ================= HELPERS ================= */

        private string? FindPolicyDocument(Guid policyId, string documentId)
        {
            var folder = Path.Combine(
                _env.ContentRootPath,
                "Uploads",
                "Policies",
                policyId.ToString()
            );

            if (!Directory.Exists(folder))
                return null;

            return Directory.GetFiles(folder)
                .FirstOrDefault(f =>
                    Path.GetFileName(f).StartsWith(documentId + "_"));
        }

        private static string GetContentType(string path)
        {
            var provider = new FileExtensionContentTypeProvider();
            return provider.TryGetContentType(path, out var contentType)
                ? contentType
                : "application/octet-stream";
        }
    }
}
