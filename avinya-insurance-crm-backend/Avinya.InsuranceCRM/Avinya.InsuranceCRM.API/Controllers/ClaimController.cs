using Avinya.InsuranceCRM.API.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/claim")]
    [Authorize(Policy = "ApprovedAdvisor")]
    public class ClaimController : ControllerBase
    {
        private readonly IClaimRepository _claimRepository;
        private readonly IWebHostEnvironment _env;

        public ClaimController(
            IClaimRepository claimRepository,
            IWebHostEnvironment env)
        {
            _claimRepository = claimRepository;
            _env = env;
        }

        /*   CREATE / UPDATE CLAIM   */

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateOrUpdate(
            [FromForm] UpsertClaimRequest request)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token");

            InsuranceClaim claim;
            var isUpdate = request.ClaimId.HasValue;

            /* ---------- UPDATE ---------- */
            if (isUpdate)
            {
                claim = await _claimRepository.GetByIdAsync(
                    advisorId,
                    request.ClaimId!.Value
                );

                if (claim == null)
                    return NotFound("Claim not found");

                claim.UpdatedAt = DateTime.UtcNow;
            }
            /* ---------- CREATE ---------- */
            else
            {
                claim = new InsuranceClaim
                {
                    ClaimId = Guid.NewGuid(),
                    Status = "Open",
                    CreatedAt = DateTime.UtcNow
                };
            }

            /* ---------- MAP DATA ---------- */
            claim.PolicyId = request.PolicyId;
            claim.CustomerId = request.CustomerId;
            claim.ClaimTypeId = request.ClaimTypeId;
            claim.ClaimStageId = request.ClaimStageId;
            claim.ClaimHandlerId = request.ClaimHandlerId;
            claim.IncidentDate = request.IncidentDate;
            claim.ClaimAmount = request.ClaimAmount;
            claim.ApprovedAmount = request.ApprovedAmount;
            claim.TATDays = request.TATDays;
            claim.Status = request.Status ?? claim.Status;
            claim.Notes = request.Notes;

            /* ---------- FILE UPLOAD ---------- */
            if (request.Documents != null && request.Documents.Any())
            {
                var uploadRoot = Path.Combine(
                    _env.ContentRootPath,
                    "Uploads",
                    "Claims",
                    claim.ClaimId.ToString()
                );

                Directory.CreateDirectory(uploadRoot);

                var newFiles = new List<string>();

                foreach (var file in request.Documents)
                {
                    if (file.Length == 0) continue;

                    var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                    var filePath = Path.Combine(uploadRoot, fileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);

                    newFiles.Add(fileName);
                }

                var existingFiles = claim.Documents?
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .ToList() ?? new List<string>();

                existingFiles.AddRange(newFiles);
                claim.Documents = string.Join(",", existingFiles);
            }

            /* ---------- SAVE ---------- */
            if (isUpdate)
                await _claimRepository.UpdateAsync(claim, advisorId);
            else
                await _claimRepository.AddAsync(claim, advisorId);

            return Ok(new
            {
                claim.ClaimId,
                claim.Status,
                claim.Documents,
                Message = isUpdate
                    ? "Claim updated successfully"
                    : "Claim created successfully"
            });
        }

        /*   GET PAGED   */

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

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token");

            var result = await _claimRepository.GetPagedAsync(
                advisorId,
                pageNumber,
                pageSize,
                search,
                customerId,
                policyId,
                claimTypeId,
                claimStageId,
                claimHandlerId,
                status
            );

            return Ok(new
            {
                result.TotalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(
                    result.TotalRecords / (double)pageSize
                ),
                Data = result.Data.Select(x => new
                {
                    x.ClaimId,
                    x.Status,
                    x.IncidentDate,
                    x.ClaimAmount,
                    x.ApprovedAmount,
                    x.TATDays,
                    x.CreatedAt,
                    x.Documents,
                    x.Notes,

                    Customer = new
                    {
                        x.Customer.CustomerId,
                        x.Customer.FullName,
                        x.Customer.Email
                    },

                    Policy = new
                    {
                        x.Policy.PolicyId,
                        x.Policy.PolicyNumber,
                        PolicyStatus = x.Policy.PolicyStatus.StatusName
                    },

                    Insurer = new
                    {
                        x.Policy.Insurer.InsurerId,
                        x.Policy.Insurer.InsurerName
                    },

                    Product = new
                    {
                        x.Policy.Product.ProductId,
                        x.Policy.Product.ProductName
                    },

                    ClaimType = x.ClaimType.TypeName,
                    ClaimStage = x.ClaimStage.StageName,
                    ClaimHandler = x.ClaimHandler.HandlerName
                })
            });
        }

        /*   DELETE CLAIM   */

        [HttpDelete("{claimId:guid}")]
        public async Task<IActionResult> DeleteClaim(Guid claimId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token");

            var claim = await _claimRepository.GetByIdAsync(advisorId, claimId);

            if (claim == null)
                return NotFound("Claim not found");

            var claimFolder = Path.Combine(
                _env.ContentRootPath,
                "Uploads",
                "Claims",
                claimId.ToString()
            );

            if (Directory.Exists(claimFolder))
            {
                Directory.Delete(claimFolder, recursive: true);
            }

            await _claimRepository.DeleteByIdAsync(advisorId, claimId);

            return Ok("Claim deleted successfully");
        }

        /*   DOCUMENT PREVIEW   */

        [HttpGet("{claimId:guid}/documents/{documentId}/preview")]
        public IActionResult PreviewDocument(Guid claimId, string documentId)
        {
            var folder = Path.Combine(
                _env.ContentRootPath,
                "Uploads",
                "Claims",
                claimId.ToString()
            );

            if (!Directory.Exists(folder))
                return NotFound();

            var filePath = Directory.GetFiles(folder)
                .FirstOrDefault(f =>
                    Path.GetFileName(f).StartsWith(documentId + "_"));

            if (filePath == null)
                return NotFound();

            return PhysicalFile(
                filePath,
                GetContentType(filePath),
                enableRangeProcessing: true
            );
        }

        /*   DOCUMENT DOWNLOAD   */

        [HttpGet("{claimId:guid}/documents/{documentId}/download")]
        public IActionResult DownloadDocument(Guid claimId, string documentId)
        {
            var folder = Path.Combine(
                _env.ContentRootPath,
                "Uploads",
                "Claims",
                claimId.ToString()
            );

            if (!Directory.Exists(folder))
                return NotFound();

            var filePath = Directory.GetFiles(folder)
                .FirstOrDefault(f =>
                    Path.GetFileName(f).StartsWith(documentId + "_"));

            if (filePath == null)
                return NotFound();

            return PhysicalFile(
                filePath,
                GetContentType(filePath),
                Path.GetFileName(filePath)
            );
        }

        /*   DELETE DOCUMENT   */

        [HttpDelete("{claimId:guid}/documents/{documentId}")]
        public async Task<IActionResult> DeleteDocument(
            Guid claimId,
            string documentId)
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized("Invalid token");

            var claim = await _claimRepository.GetByIdAsync(advisorId, claimId);

            if (claim == null)
                return NotFound("Claim not found");

            if (string.IsNullOrWhiteSpace(claim.Documents))
                return BadRequest("No documents found");

            var files = claim.Documents
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .ToList();

            var fileName = files.FirstOrDefault(f =>
                f.StartsWith(documentId + "_"));

            if (fileName == null)
                return NotFound("Document not found");

            var filePath = Path.Combine(
                _env.ContentRootPath,
                "Uploads",
                "Claims",
                claimId.ToString(),
                fileName
            );

            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);

            files.Remove(fileName);
            claim.Documents = files.Any()
                ? string.Join(",", files)
                : null;

            claim.UpdatedAt = DateTime.UtcNow;

            await _claimRepository.UpdateAsync(claim, advisorId);

            return Ok("Document deleted successfully");
        }

        /*   HELPERS   */

        private static string GetContentType(string path)
        {
            var ext = Path.GetExtension(path).ToLowerInvariant();

            return ext switch
            {
                ".pdf" => "application/pdf",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream"
            };
        }
    }
}
