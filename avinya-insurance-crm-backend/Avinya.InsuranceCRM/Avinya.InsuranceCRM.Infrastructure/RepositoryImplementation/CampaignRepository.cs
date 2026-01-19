using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class CampaignRepository : ICampaignRepository
    {
        private readonly AppDbContext _db;

        public CampaignRepository(AppDbContext db)
        {
            _db = db;
        }

        /* ================= CREATE ================= */

        public async Task<Campaign> CreateCampaignAsync(
            Guid companyId,
            string userId,
            string role,
            Campaign campaign,
            List<CampaignTemplate> templates,
            List<CampaignRule> rules,
            List<Guid>? customerIds)
        {
            using var tx = await _db.Database.BeginTransactionAsync();

            try
            {
                campaign.CampaignId = Guid.NewGuid();
                campaign.CompanyId = companyId;
                campaign.AdvisorId = userId; // creator
                campaign.CreatedAt = DateTime.UtcNow;
                campaign.IsActive = true;

                _db.Campaigns.Add(campaign);

                /* ===== RULES ===== */
                foreach (var rule in rules)
                {
                    rule.CampaignRuleId = Guid.NewGuid();
                    rule.CampaignId = campaign.CampaignId;
                    rule.CreatedAt = DateTime.UtcNow;
                    rule.IsActive = true;

                    _db.CampaignRules.Add(rule);
                }

                /* ===== TEMPLATES ===== */
                foreach (var template in templates)
                {
                    template.TemplateId = Guid.NewGuid();
                    template.CampaignId = campaign.CampaignId;

                    _db.CampaignTemplates.Add(template);
                }

                /* ===== CUSTOMERS ===== */
                if (customerIds != null && customerIds.Any())
                {
                    foreach (var customerId in customerIds.Distinct())
                    {
                        _db.CampaignCustomers.Add(new CampaignCustomer
                        {
                            CampaignCustomerId = Guid.NewGuid(),
                            CampaignId = campaign.CampaignId,
                            CustomerId = customerId,
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                }

                _db.CampaignLogs.Add(new CampaignLog
                {
                    CampaignLogId = Guid.NewGuid(),
                    CampaignId = campaign.CampaignId,
                    CustomerId = Guid.Empty,
                    TriggerDate = DateTime.UtcNow.Date,
                    Channel = "System",
                    Status = "Created"
                });

                await _db.SaveChangesAsync();
                await tx.CommitAsync();

                return campaign;
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        /* ================= GET FOR UPSERT ================= */

        public async Task<CampaignCreateRequest?> GetForUpsertAsync(Guid campaignId)
        {
            var rules = await _db.CampaignRules
                .Where(r => r.CampaignId == campaignId && r.IsActive)
                .OrderBy(r => r.SortOrder)
                .AsNoTracking()
                .ToListAsync();

            var campaign = await _db.Campaigns
                .Include(c => c.CampaignCustomers)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.CampaignId == campaignId);

            if (campaign == null)
                return null;

            var templates = await _db.CampaignTemplates
                .Where(t => t.CampaignId == campaignId)
                .AsNoTracking()
                .ToListAsync();

            var customerIds = campaign.CampaignCustomers
                .Select(cc => cc.CustomerId)
                .ToList();

            return new CampaignCreateRequest
            {
                Campaign = campaign,
                Templates = templates,
                Rules = rules,
                CustomerIds = customerIds
            };
        }

        /* ================= GET BY ID ================= */

        public async Task<Campaign?> GetByIdAsync(
            Guid campaignId,
            Guid companyId,
            string userId,
            string role)
        {
            var query = _db.Campaigns
                .Include(c => c.Templates)
                .Include(c => c.CampaignCustomers)
                .Include(c => c.Rules)
                .AsNoTracking()
                .Where(c =>
                    c.CampaignId == campaignId &&
                    c.CompanyId == companyId &&
                    c.IsActive);

            // Advisor can access only own campaigns
            if (role == "Advisor")
            {
                query = query.Where(c => c.AdvisorId == userId);
            }

            return await query.FirstOrDefaultAsync();
        }

        /* ================= GET PAGED ================= */

        public async Task<(List<Campaign> Items, int TotalCount)> GetPagedAsync(
            Guid companyId,
            string userId,
            string role,
            int pageNumber,
            int pageSize,
            string? search)
        {
            var query = _db.Campaigns
                .AsNoTracking()
                .Where(c =>
                    c.CompanyId == companyId &&
                    c.IsActive);

            // Advisor sees only own campaigns
            if (role == "Advisor")
            {
                query = query.Where(c => c.AdvisorId == userId);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(c =>
                    c.Name.Contains(search) ||
                    c.CampaignType.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        /* ================= UPDATE ================= */

        public async Task UpdateCampaignAsync(
            Guid campaignId,
            Guid companyId,
            string userId,
            string role,
            Campaign campaign,
            List<CampaignTemplate> templates,
            List<CampaignRule> rules,
            List<Guid>? customerIds)
        {
            using var tx = await _db.Database.BeginTransactionAsync();

            var query = _db.Campaigns
                .Include(c => c.Templates)
                .Include(c => c.CampaignCustomers)
                .Include(c => c.Rules)
                .Where(c =>
                    c.CampaignId == campaignId &&
                    c.CompanyId == companyId);

            if (role == "Advisor")
            {
                query = query.Where(c => c.AdvisorId == userId);
            }

            var existing = await query.FirstOrDefaultAsync();
            if (existing == null)
                throw new InvalidOperationException("Campaign not found");

            existing.Name = campaign.Name;
            existing.CampaignType = campaign.CampaignType;
            existing.Channel = campaign.Channel;
            existing.StartDate = campaign.StartDate;
            existing.EndDate = campaign.EndDate;
            existing.IsActive = campaign.IsActive;
            existing.ApplyToAllCustomers = campaign.ApplyToAllCustomers;

            /* ===== RULES ===== */
            _db.CampaignRules.RemoveRange(existing.Rules);

            foreach (var rule in rules)
            {
                rule.CampaignRuleId = Guid.NewGuid();
                rule.CampaignId = campaignId;
                rule.CreatedAt = DateTime.UtcNow;
                rule.IsActive = true;

                _db.CampaignRules.Add(rule);
            }

            /* ===== TEMPLATES ===== */
            _db.CampaignTemplates.RemoveRange(existing.Templates);

            foreach (var template in templates)
            {
                template.TemplateId = Guid.NewGuid();
                template.CampaignId = campaignId;

                _db.CampaignTemplates.Add(template);
            }

            /* ===== CUSTOMERS ===== */
            _db.CampaignCustomers.RemoveRange(existing.CampaignCustomers);

            if (customerIds != null && customerIds.Any())
            {
                foreach (var customerId in customerIds.Distinct())
                {
                    _db.CampaignCustomers.Add(new CampaignCustomer
                    {
                        CampaignCustomerId = Guid.NewGuid(),
                        CampaignId = campaignId,
                        CustomerId = customerId,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            await _db.SaveChangesAsync();
            await tx.CommitAsync();
        }

        /* ================= DELETE ================= */

        public async Task DeleteCampaignAsync(
            Guid campaignId,
            Guid companyId,
            string userId,
            string role)
        {
            var query = _db.Campaigns
                .Where(c =>
                    c.CampaignId == campaignId &&
                    c.CompanyId == companyId);

            if (role == "Advisor")
            {
                query = query.Where(c => c.AdvisorId == userId);
            }

            var campaign = await query.FirstOrDefaultAsync();
            if (campaign == null) return;

            campaign.IsActive = false;

            _db.CampaignLogs.Add(new CampaignLog
            {
                CampaignLogId = Guid.NewGuid(),
                CampaignId = campaignId,
                CustomerId = Guid.Empty,
                TriggerDate = DateTime.UtcNow.Date,
                Channel = "System",
                Status = "Deleted"
            });

            await _db.SaveChangesAsync();
        }

        /* ================= DROPDOWN ================= */

        public async Task<List<(Guid CampaignId, string Name)>> GetDropdownAsync(
            Guid companyId,
            string userId,
            string role)
        {
            var query = _db.Campaigns
                .AsNoTracking()
                .Where(c =>
                    c.CompanyId == companyId &&
                    c.IsActive);

            if (role == "Advisor")
            {
                query = query.Where(c => c.AdvisorId == userId);
            }

            return await query
                .OrderBy(c => c.Name)
                .Select(c => new ValueTuple<Guid, string>(
                    c.CampaignId,
                    c.Name))
                .ToListAsync();
        }

        /* ================= CAMPAIGN TYPES ================= */

        public async Task<List<(int CampaignTypeId, string Name)>> GetCampaignTypeDropdownAsync()
        {
            return await _db.MasterCampaignTypes
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Name)
                .Select(x => new ValueTuple<int, string>(
                    x.CampaignTypeId,
                    x.Name))
                .ToListAsync();
        }
    }
}
