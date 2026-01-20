using Avinya.InsuranceCRM.Application.DTOs;
using Avinya.InsuranceCRM.Application.DTOs.LeadFollowUp;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class LeadFollowUpRepository : ILeadFollowUpRepository
    {
        private readonly AppDbContext _context;

        public LeadFollowUpRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(LeadFollowUp? Data, string? Error)> AddOrUpdateAsync(
                Guid? followUpId,
                Guid leadId,
                string? notes,
                DateTime nextFollowupDate,
                int status,
                Guid advisorId)
        {
            var lead = await _context.Leads
                .FirstOrDefaultAsync(l => l.LeadId == leadId);

            if (lead == null)
                return (null, "Lead not found");

            if (followUpId.HasValue)
            {
                var existing = await _context.LeadFollowUps
                    .FirstOrDefaultAsync(f => f.FollowUpId == followUpId.Value);

                if (existing == null)
                    return (null, "Follow-up not found");

                existing.Remark = notes;
                existing.NextFollowUpDate = nextFollowupDate;
                existing.Status = status;
                existing.UpdatedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return (existing, null);
            }

            var latestFollowup = await _context.LeadFollowUps
                .Where(f => f.LeadId == leadId)
                .OrderByDescending(f => f.CreatedAt)
                .FirstOrDefaultAsync();

            if (latestFollowup != null &&
                (latestFollowup.Status == 1 || latestFollowup.Status == 2))
                return (null, "A follow-up is already pending or in progress for this lead.");

            var newFollowup = new LeadFollowUp
            {
                FollowUpId = Guid.NewGuid(),
                LeadId = leadId,
                Remark = notes,
                NextFollowUpDate = nextFollowupDate,
                Status = 1, 
                CreatedBy = advisorId,
                CreatedAt = DateTime.UtcNow
            };

            lead.LeadStatusId = 4;
            lead.UpdatedAt = DateTime.UtcNow;

            _context.LeadFollowUps.Add(newFollowup);
            await _context.SaveChangesAsync();

            return (newFollowup, null);
        }

        public async Task<(bool leadExists, List<LeadFollowupDTO>? followups)> GetFollowupHistoryAsync(Guid leadId)
        {
            try
            {
                bool leadExists = await _context.Leads.AnyAsync(l => l.LeadId == leadId);
                if (!leadExists)
                    return (false, null);

                var followups = await (from f in _context.LeadFollowUps
                                       join l in _context.Leads on f.LeadId equals l.LeadId
                                       join s in _context.LeadFollowupStatuses on f.Status equals s.LeadFollowupStatusID
                                       join u in _context.Users on f.CreatedBy.ToString() equals u.Id into users
                                       from cu in users.DefaultIfEmpty()
                                       where f.LeadId == leadId
                                       orderby f.CreatedAt descending
                                       select new LeadFollowupDTO
                                       {
                                           FollowUpID = f.FollowUpId,
                                           LeadID = f.LeadId,
                                           LeadNo = l.LeadNo,
                                           Remark = f.Remark,
                                           NextFollowupDate = f.NextFollowUpDate,
                                           Status = f.Status,
                                           StatusName = s.StatusName,
                                           FollowUpBy = f.CreatedBy,
                                           FollowUpByName = cu != null ? cu.UserName : null,
                                           CreatedDate = f.CreatedAt
                                       }).ToListAsync();

                return (true, followups);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
