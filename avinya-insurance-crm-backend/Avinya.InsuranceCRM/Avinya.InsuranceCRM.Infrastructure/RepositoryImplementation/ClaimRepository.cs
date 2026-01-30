using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class ClaimRepository : IClaimRepository
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ClaimRepository(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<(UpsertClaimRequest claim, bool isUpdate)> CreateOrUpdateAsync(
            string advisorId,
            Guid companyId,
            UpsertClaimRequest request)
        {
            bool isUpdate = request.ClaimId.HasValue;
            InsuranceClaim claim;

            if (isUpdate)
            {
                claim = await _context.Claims.FirstOrDefaultAsync(x =>
                    x.ClaimId == request.ClaimId &&
                    x.AdvisorId == advisorId &&
                    x.CompanyId == companyId)
                    ?? throw new KeyNotFoundException("Claim not found");

                claim.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                claim = new InsuranceClaim
                {
                    ClaimId = Guid.NewGuid(),
                    AdvisorId = advisorId,
                    CompanyId = companyId,
                    Status = "Open",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Claims.Add(claim);
            }

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

            if (request.Documents?.Any() == true)
            {
                var folderPath = Path.Combine(
                    _env.WebRootPath,
                    "Uploads",
                    "Claims",
                    claim.ClaimId.ToString()
                );

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var savedFiles = new List<string>();
                string allowedExtension = null;

                foreach (var document in request.Documents)
                {
                    if (string.IsNullOrWhiteSpace(document))
                        continue;

                    string header = null;
                    string base64Data;

                    if (document.Contains(","))
                    {
                        var parts = document.Split(',');
                        if (parts.Length != 2)
                            continue;

                        header = parts[0];
                        base64Data = parts[1];
                    }
                    else
                    {
                        base64Data = document;
                    }

                    string extension;

                    if (header != null && header.Contains("application/pdf"))
                        extension = ".pdf";
                    else if (header != null && header.Contains("image/jpeg"))
                        extension = ".jpg";
                    else
                        extension = ".jpg"; 

                    if (allowedExtension == null)
                        allowedExtension = extension;
                    else if (allowedExtension != extension)
                        continue;

                    byte[] fileBytes;
                    try
                    {
                        fileBytes = Convert.FromBase64String(base64Data);
                    }
                    catch
                    {
                        continue;
                    }

                    var fileName = $"claim_{DateTime.UtcNow.Ticks}{extension}";
                    var filePath = Path.Combine(folderPath, fileName);

                    await System.IO.File.WriteAllBytesAsync(filePath, fileBytes);

                    var webPath = $"/Uploads/Claims/{claim.ClaimId}/{fileName}";
                    savedFiles.Add(webPath);
                }

                if (savedFiles.Any())
                {
                    var existingDocs = string.IsNullOrEmpty(claim.Documents)
                        ? new List<string>()
                        : claim.Documents.Split(',').ToList();

                    existingDocs.AddRange(savedFiles);
                    claim.Documents = string.Join(",", existingDocs);
                }
            }


            await _context.SaveChangesAsync();

            var response = new UpsertClaimRequest
            {
                ClaimId = claim.ClaimId,

                PolicyId = claim.PolicyId,
                CustomerId = claim.CustomerId,

                ClaimTypeId = claim.ClaimTypeId,
                ClaimStageId = claim.ClaimStageId,
                ClaimHandlerId = claim.ClaimHandlerId,

                IncidentDate = claim.IncidentDate,
                ClaimAmount = claim.ClaimAmount,
                ApprovedAmount = claim.ApprovedAmount,

                TATDays = claim.TATDays,
                Status = claim.Status,
                Notes = claim.Notes,

                Documents = claim.Documents?
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .ToList() ?? new List<string>(),
            };

            return (response, isUpdate);
        }


        public async Task<(IEnumerable<InsuranceClaim>, int)> GetPagedAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            string? search,
            Guid? customerId,
            Guid? policyId,
            int? claimTypeId,
            int? claimStageId,
            int? claimHandlerId,
            string? status)
        {
            var query = _context.Claims
                .Where(x => x.AdvisorId == advisorId)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(x =>
                    x.Status.Contains(search));

            if (customerId.HasValue) query = query.Where(x => x.CustomerId == customerId);
            if (policyId.HasValue) query = query.Where(x => x.PolicyId == policyId);
            if (claimTypeId.HasValue) query = query.Where(x => x.ClaimTypeId == claimTypeId);
            if (claimStageId.HasValue) query = query.Where(x => x.ClaimStageId == claimStageId);
            if (claimHandlerId.HasValue) query = query.Where(x => x.ClaimHandlerId == claimHandlerId);
            if (!string.IsNullOrWhiteSpace(status)) query = query.Where(x => x.Status == status);

            var total = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (data, total);
        }

        public async Task<bool> DeleteAsync(string advisorId, Guid claimId)
        {
            var claim = await _context.Claims
                .FirstOrDefaultAsync(x =>
                    x.ClaimId == claimId &&
                    x.AdvisorId == advisorId);

            if (claim == null) return false;

            _context.Claims.Remove(claim);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateStageAsync(
            string advisorId,
            Guid claimId,
            int stageId,
            string? notes)
        {
            var claim = await _context.Claims
                .FirstOrDefaultAsync(x =>
                    x.ClaimId == claimId &&
                    x.AdvisorId == advisorId);

            if (claim == null) return false;

            claim.ClaimStageId = stageId;
            claim.Status = stageId switch
            {
                1 => "Open",
                3 => "In Review",
                4 => "Approved",
                5 => "Rejected",
                6 => "Closed",
                _ => claim.Status
            };

            if (!string.IsNullOrWhiteSpace(notes))
                claim.Notes = notes;

            claim.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDocumentAsync(
            string advisorId,
            Guid claimId,
            string documentId)
        {
            var claim = await _context.Claims.FirstOrDefaultAsync(x =>
        x.ClaimId == claimId &&
        x.AdvisorId == advisorId);

            if (claim == null || string.IsNullOrWhiteSpace(claim.Documents))
                return false;

            var files = claim.Documents
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(x => x.Trim())
                .ToList();

            var file = files.FirstOrDefault(x =>
                Path.GetFileName(x).Equals(documentId, StringComparison.OrdinalIgnoreCase));

            if (file == null)
                return false;

            var filePath = Path.Combine(_env.WebRootPath, "Uploads", "Claims", claimId.ToString(), documentId);
            if (File.Exists(filePath))
                File.Delete(filePath);

            files.Remove(file);
            claim.Documents = files.Any() ? string.Join(",", files) : null;

            await _context.SaveChangesAsync();
            return true;
        }

        public string? GetDocumentBase64(Guid claimId, string documentId)
        {
            var folder = Path.Combine(_env.WebRootPath, "Uploads", "Claims", claimId.ToString());

            if (!Directory.Exists(folder))
                return null;

            var filePath = Directory.GetFiles(folder)
                .FirstOrDefault(x => Path.GetFileName(x).Equals(documentId, StringComparison.OrdinalIgnoreCase));

            if (filePath == null || !File.Exists(filePath))
                return null;

            var fileBytes = File.ReadAllBytes(filePath);
            var base64 = Convert.ToBase64String(fileBytes);

            return base64; 
        }

        public async Task<List<ClaimTypeMaster>> GetClaimTypesAsync()
        {
            return await _context.ClaimTypes
                .Where(x => x.IsActive)
                .OrderBy(x => x.TypeName)
                .ToListAsync();
        }

        public async Task<List<ClaimStageMaster>> GetClaimStagesAsync()
        {
            return await _context.ClaimStages
                .Where(x => x.IsActive)
                .OrderBy(x => x.ClaimStageId)
                .ToListAsync();
        }

        public async Task<List<ClaimHandlerMaster>> GetClaimHandlersAsync()
        {
            return await _context.ClaimHandlers
                .Where(x => x.IsActive)
                .OrderBy(x => x.HandlerName)
                .ToListAsync();
        }

    }
}
