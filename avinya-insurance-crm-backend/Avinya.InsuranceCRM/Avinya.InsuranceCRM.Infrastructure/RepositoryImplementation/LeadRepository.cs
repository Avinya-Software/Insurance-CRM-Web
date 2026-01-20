using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Application.DTOs;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Helper;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Avinya.InsuranceCRM.Infrastructure.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

public class LeadRepository : ILeadRepository
{
    private readonly AppDbContext _context;

    public LeadRepository(AppDbContext context)
    {
        _context = context;
    }


    public async Task<(Lead lead, bool isUpdate)> CreateOrUpdateAsync(
        string advisorId,
        Guid? companyId,
        CreateOrUpdateLeadRequest request)
    {
        if (string.IsNullOrEmpty(advisorId))
            throw new UnauthorizedAccessException("Advisor not found");

        if (request.LeadId.HasValue)
        {
            var lead = await _context.Leads.FirstOrDefaultAsync(x =>
                x.LeadId == request.LeadId.Value &&
                x.AdvisorId == advisorId);

            if (lead == null)
                throw new KeyNotFoundException("Lead not found");

            lead.FullName = request.FullName;
            lead.Email = request.Email;
            lead.Mobile = request.Mobile;
            lead.LeadStatusId = request.LeadStatusId;
            lead.LeadSourceId = request.LeadSourceId;
            lead.LeadSourceDescription = request.LeadSourceDescription;
            lead.Address = request.Address;
            lead.Notes = request.Notes;
            lead.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return (lead, true);
        }

        Customer? customer = null;
        Guid customerId = request.CustomerId ?? Guid.Empty;

        if (!request.CustomerId.HasValue)
        {
            if (string.IsNullOrWhiteSpace(request.FullName) ||
                string.IsNullOrWhiteSpace(request.Mobile))
                throw new ArgumentException("FullName and Mobile are required");

            customer = new Customer
            {
                CustomerId = Guid.NewGuid(),
                FullName = request.FullName,
                PrimaryMobile = request.Mobile,
                Email = request.Email,
                Address = request.Address,
                AdvisorId = advisorId,
                CreatedAt = DateTime.UtcNow,
                CompanyId = companyId
            };

            await _context.Customers.AddAsync(customer);
            customerId = customer.CustomerId;
        }

        var newLead = new Lead
        {
            LeadId = Guid.NewGuid(),
            LeadNo = await GenerateLeadNoAsync(advisorId),
            CustomerId = customerId,
            FullName = request.FullName,
            Email = request.Email,
            Mobile = request.Mobile,
            LeadStatusId = request.LeadStatusId,
            LeadSourceId = request.LeadSourceId,
            LeadSourceDescription = request.LeadSourceDescription,
            AdvisorId = advisorId,
            Address = request.Address,
            CompanyId = companyId,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Leads.AddAsync(newLead);

        if (customer != null)
        {
            customer.LeadId = newLead.LeadId;
            customer.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return (newLead, false);
    }


    public async Task<(IEnumerable<LeadListDto> Data, int TotalCount)> GetPagedAsync(
        string advisorId,
        string role,
        Guid? companyId,
        int pageNumber,
        int pageSize,
        string? search,
        string? fullName,
        string? email,
        string? mobile,
        int? leadStatusId,
        int? leadSourceId)
    {


        IQueryable<Lead> query = _context.Leads
        .Include(x => x.LeadStatus)
        .Include(x => x.LeadSource);

        if (role == "Advisor")
        {
            query = query.Where(x => x.AdvisorId == advisorId);
        }
        else if (role == "CompanyAdmin" && companyId.HasValue)
        {
            query = query.Where(x => x.CompanyId == companyId);
        }

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(x =>
                x.FullName.Contains(search) ||
                x.Email.Contains(search) ||
                x.Mobile.Contains(search));

        if (!string.IsNullOrWhiteSpace(fullName))
            query = query.Where(x => x.FullName.Contains(fullName));

        if (!string.IsNullOrWhiteSpace(email))
            query = query.Where(x => x.Email.Contains(email));

        if (!string.IsNullOrWhiteSpace(mobile))
            query = query.Where(x => x.Mobile.Contains(mobile));

        if (leadStatusId.HasValue)
            query = query.Where(x => x.LeadStatusId == leadStatusId);

        if (leadSourceId.HasValue)
            query = query.Where(x => x.LeadSourceId == leadSourceId);

        var totalCount = await query.CountAsync();

        var data = await query
        .OrderByDescending(x => x.CreatedAt)
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .Select(x => new LeadListDto
        {
            LeadId = x.LeadId,
            LeadNo = x.LeadNo,
            FullName = x.FullName,
            Email = x.Email,
            Mobile = x.Mobile,
            Address = x.Address,

            LeadStatusId = x.LeadStatusId,
            LeadStatusName = x.LeadStatus.StatusName,

            LeadSourceId = x.LeadSourceId,
            LeadSourceName = x.LeadSource.SourceName,
            LeadSourceDescription = x.LeadSourceDescription,

            CompanyId = x.CompanyId,
            AdvisorId = x.AdvisorId,

            IsConverted = x.IsConverted,
            CustomerId = x.CustomerId,

            Notes = x.Notes,
            CreatedAt = DateTimeHelper.ConvertUtcToLocal(x.CreatedAt),
            UpdatedAt = x.UpdatedAt,

            FollowUps = x.FollowUps
                .OrderByDescending(f => f.CreatedAt)
                .Select(f => new LeadFollowUpDto
                {
                    FollowUpId = f.FollowUpId,
                    FollowUpDate = f.FollowUpDate,
                    NextFollowUpDate = f.NextFollowUpDate,
                    CreatedAt = f.CreatedAt
                })
                .ToList()
        })
        .ToListAsync();

    return (data, totalCount);
    }


    private async Task<string> GenerateLeadNoAsync(string advisorId)
    {
        var lastLeadNo = await _context.Leads
            .Where(x => x.AdvisorId == advisorId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => x.LeadNo)
            .FirstOrDefaultAsync();

        int next = 1;
        if (!string.IsNullOrEmpty(lastLeadNo) &&
            int.TryParse(lastLeadNo.Split('-').Last(), out int n))
            next = n + 1;

        return $"LEAD-{next:D3}";
    }

    public async Task<List<LeadStatus>> GetLeadStatusesAsync()
        => await _context.LeadStatuses.OrderBy(x => x.StatusName).ToListAsync();

    public async Task<List<LeadSource>> GetLeadSourcesAsync()
        => await _context.LeadSources.OrderBy(x => x.SourceName).ToListAsync();

    public async Task<bool> UpdateLeadStatusAsync(
        string advisorId,
        Guid leadId,
        int statusId,
        string? notes)
    {
        var lead = await _context.Leads.FirstOrDefaultAsync(x =>
            x.LeadId == leadId &&
            x.AdvisorId == advisorId);

        if (lead == null) return false;

        lead.LeadStatusId = statusId;
        lead.Notes = notes;
        lead.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(string advisorId, Guid leadId)
    {
        var lead = await _context.Leads.FirstOrDefaultAsync(x =>
            x.LeadId == leadId &&
            x.AdvisorId == advisorId);

        if (lead == null) return false;

        _context.Leads.Remove(lead);
        await _context.SaveChangesAsync();
        return true;
    }
}
