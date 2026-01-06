using Avinya.InsuranceCRM.API.Helper;
using Avinya.InsuranceCRM.API.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InsurerController : ControllerBase
    {
        private readonly IInsurerRepository _repo;

        public InsurerController(IInsurerRepository repo)
        {
            _repo = repo;
        }

        // ---------- ADD / UPDATE ----------
        [HttpPost]
        public async Task<IActionResult> CreateOrUpdate(
            CreateOrUpdateInsurerRequest request)
        {
            if (request.InsurerId.HasValue)
            {
                var insurer = await _repo.GetByIdAsync(request.InsurerId.Value);
                if (insurer == null)
                    return NotFound("Insurer not found");

                insurer.InsurerName = request.InsurerName;
                insurer.ShortCode = request.ShortCode;
                insurer.ContactDetails = request.ContactDetails;
                insurer.PortalUrl = request.PortalUrl;
                insurer.PortalUsername = request.PortalUsername;

                if (!string.IsNullOrWhiteSpace(request.PortalPassword))
                {
                    insurer.PortalPassword =
                        EncryptionHelper.Encrypt(request.PortalPassword);
                }

                insurer.UpdatedAt = DateTime.UtcNow;
                await _repo.UpdateAsync(insurer);

                return Ok("Insurer updated successfully");
            }

            var newInsurer = new Insurer
            {
                InsurerId = Guid.NewGuid(),
                InsurerName = request.InsurerName,
                ShortCode = request.ShortCode,
                ContactDetails = request.ContactDetails,
                PortalUrl = request.PortalUrl,
                PortalUsername = request.PortalUsername,
                PortalPassword = string.IsNullOrWhiteSpace(request.PortalPassword)
                    ? null
                    : EncryptionHelper.Encrypt(request.PortalPassword),
                CreatedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(newInsurer);
            return Ok("Insurer created successfully");
        }

        // ---------- SHOW PASSWORD (ON BUTTON CLICK) ----------
        [HttpGet("{id}/portal-password")]
        public async Task<IActionResult> GetPortalPassword(Guid id)
        {
            var insurer = await _repo.GetByIdAsync(id);
            if (insurer == null || insurer.PortalPassword == null)
                return NotFound("Password not found");

            return Ok(new
            {
                password = EncryptionHelper.Decrypt(insurer.PortalPassword)
            });
        }
        [HttpGet]
        public async Task<IActionResult> GetPaged([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
        {
            var result = await _repo.GetPagedAsync(
                pageNumber,
                pageSize,
                search
            );

            return Ok(new
            {
                result.TotalRecords,
                result.PageNumber,
                result.PageSize,
                TotalPages = (int)Math.Ceiling(
                    result.TotalRecords / (double)result.PageSize
                ),
                Data = result.Data.Select(x => new
                {
                    x.InsurerId,
                    x.InsurerName,
                    x.ShortCode,
                    x.ContactDetails,
                    x.PortalUrl,
                    x.PortalUsername,
                    CreatedAt = x.CreatedAt
                })
            });
        }

        // ---------- DROPDOWN ----------
        [HttpGet("dropdown")]
        public async Task<IActionResult> GetDropdown()
        {
            var insurers = await _repo.GetDropdownAsync();

            return Ok(insurers.Select(x => new
            {
                x.InsurerId,
                x.InsurerName
            }));
        }
        // ---------- DELETE INSURER ----------
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _repo.DeleteAsync(id);

            if (!deleted)
                return NotFound("Insurer not found");

            return Ok("Insurer deleted successfully");
        }
    }

}
