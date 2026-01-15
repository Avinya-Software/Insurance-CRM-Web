using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/system-events")]
    [Authorize]
    public class SystemEventsController : ControllerBase
    {
        private readonly ISystemEventRepository _repository;

        public SystemEventsController(ISystemEventRepository repository)
        {
            _repository = repository;
        }

        /* ============================================================
         * GET: Pending events for logged-in advisor
         * ============================================================ */
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingEvents()
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized();

            var events = await _repository
                .GetPendingByAdvisorAsync(advisorId);

            return Ok(events);
        }

        /* ============================================================
         * GET: Event by Id
         * ============================================================ */
        [HttpGet("{eventId:guid}")]
        public async Task<IActionResult> GetById(Guid eventId)
        {
            var systemEvent = await _repository.GetByIdAsync(eventId);

            if (systemEvent == null)
                return NotFound();

            return Ok(systemEvent);
        }

        /* ============================================================
         * POST: Create event (Admin / Worker use)
         * ============================================================ */
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(SystemEvent systemEvent)
        {
            await _repository.AddAsync(systemEvent);
            await _repository.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { eventId = systemEvent.EventId },
                systemEvent);
        }

        /* ============================================================
         * PUT: Acknowledge event
         * ============================================================ */
        [HttpPut("{eventId:guid}/acknowledge")]
        public async Task<IActionResult> Acknowledge(Guid eventId)
        {
            var systemEvent = await _repository.GetByIdAsync(eventId);

            if (systemEvent == null)
                return NotFound();

            systemEvent.IsAcknowledged = true;
            systemEvent.AcknowledgedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(systemEvent);
            await _repository.SaveChangesAsync();

            return NoContent();
        }
    }
}
