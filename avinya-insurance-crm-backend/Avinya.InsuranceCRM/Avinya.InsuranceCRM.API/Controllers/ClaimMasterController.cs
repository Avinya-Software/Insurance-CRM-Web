using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/claim-masters")]
    [Authorize(Policy = "ApprovedAdvisor")]
    public class ClaimMasterController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClaimMasterController(AppDbContext context)
        {
            _context = context;
        }

        //   CLAIM TYPE DROPDOWN  
        [HttpGet("claim-types")]
        public async Task<IActionResult> GetClaimTypes()
        {
            var data = await _context.ClaimTypes
                .Where(x => x.IsActive)
                .OrderBy(x => x.TypeName)
                .Select(x => new
                {
                    x.ClaimTypeId,
                    x.TypeName
                })
                .ToListAsync();

            return Ok(data);
        }

        //   CLAIM STAGE DROPDOWN  
        [HttpGet("claim-stages")]
        public async Task<IActionResult> GetClaimStages()
        {
            var data = await _context.ClaimStages
                .Where(x => x.IsActive)
                .OrderBy(x => x.ClaimStageId)
                .Select(x => new
                {
                    x.ClaimStageId,
                    x.StageName
                })
                .ToListAsync();

            return Ok(data);
        }

        //   CLAIM HANDLER DROPDOWN  
        [HttpGet("claim-handlers")]
        public async Task<IActionResult> GetClaimHandlers()
        {
            var data = await _context.ClaimHandlers
                .Where(x => x.IsActive)
                .OrderBy(x => x.HandlerName)
                .Select(x => new
                {
                    x.ClaimHandlerId,
                    x.HandlerName
                })
                .ToListAsync();

            return Ok(data);
        }

    }
}
