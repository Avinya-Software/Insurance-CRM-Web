using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Avinya.InsuranceCRM.Infrastructure.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

public class LeadRepository : ILeadRepository
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;

    public LeadRepository(
        AppDbContext context,
        IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    /* ================= READ ================= */

    public async Task<Lead?> GetByIdAsync(
        string advisorId,
        Guid leadId)
    {
        return await _context.Leads
            .Include(x => x.LeadStatus)
            .Include(x => x.LeadSource)
            .FirstOrDefaultAsync(x =>
                x.LeadId == leadId &&
                x.AdvisorId == advisorId);
    }

    public async Task<PagedRecordResult<Lead>> GetPagedAsync(
        string advisorId,
        int pageNumber,
        int pageSize,
        string? search,
        string? fullName,
        string? email,
        string? mobile,
        int? leadStatusId,
        int? leadSourceId)
    {
        var query = _context.Leads
            .Include(x => x.LeadStatus)
            .Include(x => x.LeadSource)
            .Where(x => x.AdvisorId == advisorId)
            .AsQueryable();

        /* 🔍 Global search */
        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.ToLower();

            query = query.Where(x =>
                x.FullName.ToLower().Contains(search) ||
                (x.Email != null && x.Email.ToLower().Contains(search)) ||
                (x.Mobile != null && x.Mobile.Contains(search)) ||
                x.LeadNo.ToLower().Contains(search)
            );
        }

        /* 👤 Full Name */
        if (!string.IsNullOrWhiteSpace(fullName))
        {
            query = query.Where(x =>
                x.FullName.ToLower().Contains(fullName.ToLower()));
        }

        /* 📧 Email */
        if (!string.IsNullOrWhiteSpace(email))
        {
            query = query.Where(x =>
                x.Email != null &&
                x.Email.ToLower().Contains(email.ToLower()));
        }

        /* 📱 Mobile */
        if (!string.IsNullOrWhiteSpace(mobile))
        {
            query = query.Where(x =>
                x.Mobile != null &&
                x.Mobile.Contains(mobile));
        }

        /* 🎯 Lead Status */
        if (leadStatusId.HasValue)
        {
            query = query.Where(x =>
                x.LeadStatusId == leadStatusId.Value);
        }

        /* 🎯 Lead Source */
        if (leadSourceId.HasValue)
        {
            query = query.Where(x =>
                x.LeadSourceId == leadSourceId.Value);
        }

        var totalRecords = await query.CountAsync();

        var leads = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedRecordResult<Lead>
        {
            TotalRecords = totalRecords,
            PageNumber = pageNumber,
            PageSize = pageSize,
            Data = leads
        };
    }

    /* ================= CREATE / UPDATE ================= */

    public async Task AddAsync(Lead lead)
    {
        _context.Leads.Add(lead);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Lead lead)
    {
        _context.Leads.Update(lead);
        await _context.SaveChangesAsync();
    }

    /* ================= DELETE ================= */

    public async Task<bool> DeleteAsync(
        string advisorId,
        Guid leadId)
    {
        var lead = await _context.Leads
            .FirstOrDefaultAsync(x =>
                x.LeadId == leadId &&
                x.AdvisorId == advisorId);

        if (lead == null)
            return false;

        // Optional safety check
        // if (lead.IsConverted || lead.CustomerId != null)
        //     return false;

        _context.Leads.Remove(lead);
        await _context.SaveChangesAsync();

        return true;
    }

    /* ================= HELPERS ================= */

    public async Task<string> GenerateLeadNoAsync()
    {
        var lastLeadNo = await _context.Leads
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => x.LeadNo)
            .FirstOrDefaultAsync();

        int nextNumber = 1;

        if (!string.IsNullOrEmpty(lastLeadNo))
        {
            var numericPart = lastLeadNo.Split('-').Last();
            int.TryParse(numericPart, out nextNumber);
            nextNumber++;
        }

        return $"LEAD-{nextNumber:D3}";
    }

    public async Task<List<LeadStatus>> GetLeadStatusesAsync()
    {
        return await _context.LeadStatuses
            .OrderBy(x => x.LeadStatusId)
            .ToListAsync();
    }

    public async Task<List<LeadSource>> GetLeadSourcesAsync()
    {
        return await _context.LeadSources
            .OrderBy(x => x.LeadSourceId)
            .ToListAsync();
    }
}
