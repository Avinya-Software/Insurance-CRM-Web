using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Avinya.InsuranceCRM.Infrastructure.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

public class LeadRepository : ILeadRepository
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;

    public LeadRepository(AppDbContext context, IEmailService emailService  )
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task<Lead?> GetByIdAsync(Guid leadId)
    {
        return await _context.Leads
            .FirstOrDefaultAsync(x => x.LeadId == leadId);
    }

    // 🔢 LEAD-001 generator
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

    public async Task<PagedRecordResult<Lead>> GetPagedAsync(
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
            .AsQueryable();

        // 🔍 Global search
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

        // 👤 Full Name
        if (!string.IsNullOrWhiteSpace(fullName))
        {
            query = query.Where(x =>
                x.FullName.ToLower().Contains(fullName.ToLower()));
        }

        // 📧 Email
        if (!string.IsNullOrWhiteSpace(email))
        {
            query = query.Where(x =>
                x.Email != null &&
                x.Email.ToLower().Contains(email.ToLower()));
        }

        // 📱 Mobile
        if (!string.IsNullOrWhiteSpace(mobile))
        {
            query = query.Where(x =>
                x.Mobile != null &&
                x.Mobile.Contains(mobile));
        }

        // 🎯 Lead Status
        if (leadStatusId.HasValue)
        {
            query = query.Where(x => x.LeadStatusId == leadStatusId.Value);
        }

        // 🎯 Lead Source
        if (leadSourceId.HasValue)
        {
            query = query.Where(x => x.LeadSourceId == leadSourceId.Value);
        }

        var totalRecords = await query.CountAsync();

        var leads = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        //if (
        //    Guid.TryParse("F3439CBF-8834-46D7-8837-B878B086CFF3", out var customerId) &&
        //    Guid.TryParse("7311C444-0FAC-4946-A426-10BF611F192E", out var policyId)
        //)
        //{
        //    await _emailService.SendRenewalReminderAsync(
        //        customerId,
        //        policyId,
        //        DateTime.UtcNow.AddDays(7),
        //        7,
        //        10000
        //    );
        //}


        return new PagedRecordResult<Lead>
        {
            TotalRecords = totalRecords,
            PageNumber = pageNumber,
            PageSize = pageSize,
            Data = leads
        };
    }
    public async Task<bool> DeleteAsync(Guid leadId)
    {
        var lead = await _context.Leads
            .FirstOrDefaultAsync(x => x.LeadId == leadId);

        if (lead == null)
            return false;

        if (lead.IsConverted || lead.CustomerId != null)
            return false;

        _context.Leads.Remove(lead);
        await _context.SaveChangesAsync();

        return true;
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
