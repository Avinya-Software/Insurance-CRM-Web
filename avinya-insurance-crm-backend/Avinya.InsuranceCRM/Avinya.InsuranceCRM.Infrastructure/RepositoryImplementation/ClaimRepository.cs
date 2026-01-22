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
                var uploadsRoot = Path.Combine(_env.WebRootPath, "Uploads");
                Directory.CreateDirectory(uploadsRoot); 

                var claimsRoot = Path.Combine(uploadsRoot, "Claims");
                Directory.CreateDirectory(claimsRoot);

                var claimFolderPath = Path.Combine(
                    claimsRoot,
                    claim.ClaimId.ToString()
                );

                Directory.CreateDirectory(claimFolderPath);

                var savedFiles = new List<string>();

                foreach (var base64 in request.Documents)
                {
                    if (string.IsNullOrWhiteSpace(base64))
                        continue;

                    var cleanBase64 = base64.Contains(",")
                        ? base64.Split(',')[1]
                        : base64;

                    byte[] fileBytes;
                    try
                    {
                        fileBytes = Convert.FromBase64String(cleanBase64);
                    }
                    catch
                    {
                        continue;
                    }

                    var extension =
                        base64.StartsWith("data:image/jpeg") ? ".jpg" :
                        base64.StartsWith("data:image/png") ? ".png" :
                        base64.StartsWith("data:application/pdf") ? ".pdf" :
                        ".bin";

                    var fileName = $"{Guid.NewGuid()}{extension}";
                    var physicalPath = Path.Combine(claimFolderPath, fileName);

                    await File.WriteAllBytesAsync(physicalPath, fileBytes);

                    var webPath = $"/Uploads/Claims/{claim.ClaimId}/{fileName}";
                    savedFiles.Add(webPath);
                }

                if (savedFiles.Any())
                {
                    var existingDocs = claim.Documents?
                        .Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .ToList() ?? new List<string>();

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

            var files = claim.Documents.Split(',').ToList();
            var file = files.FirstOrDefault(x => x.StartsWith(documentId + "_"));
            if (file == null) return false;

            File.Delete(GetDocumentPath(claimId, documentId)!);

            files.Remove(file);
            claim.Documents = files.Any() ? string.Join(",", files) : null;

            await _context.SaveChangesAsync();
            return true;
        }

        public string? GetDocumentPath(Guid claimId, string documentId)
        {
            var folder = Path.Combine(
                _env.ContentRootPath, "Uploads", "Claims", claimId.ToString());

            if (!Directory.Exists(folder)) return null;

            return Directory.GetFiles(folder)
                .FirstOrDefault(x =>
                    Path.GetFileName(x).StartsWith(documentId + "_"));
        }

    }
}
