using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Avinya.InsuranceCRM.Infrastructure.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Avinya.InsuranceCRM.Infrastructure.Workers
{
    public class CampaignWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public CampaignWorker(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessCampaigns(stoppingToken);
                }
                catch (Exception ex)
                {
                    // 🚨 NEVER crash the host
                    Console.WriteLine($"[CampaignWorker] Fatal error: {ex}");
                }

                // ⏱ Runs every 6 hours (change to minutes for testing)
                await Task.Delay(TimeSpan.FromHours(6), stoppingToken);
            }
        }

        /* ================= PROCESS CAMPAIGNS ================= */

        private async Task ProcessCampaigns(CancellationToken token)
        {
            using var scope = _scopeFactory.CreateScope();

            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<ICampaignEmailService>();

            var today = DateTime.UtcNow.Date;

            var campaigns = await db.Campaigns
                .Where(c =>
                    c.IsActive &&
                    (c.StartDate == null || c.StartDate <= today) &&
                    (c.EndDate == null || c.EndDate >= today))
                .Include(c => c.Templates)
                .Include(c => c.Rules)           // ✅ IMPORTANT
                .ToListAsync(token);

            foreach (var campaign in campaigns)
            {
                await ExecuteCampaign(
                    campaign,
                    db,
                    emailService,
                    today,
                    token);
            }
        }

        /* ================= EXECUTE SINGLE CAMPAIGN ================= */

        private async Task ExecuteCampaign(
            Campaign campaign,
            AppDbContext db,
            ICampaignEmailService emailService,
            DateTime today,
            CancellationToken token)
        {
            var template = campaign.Templates
                .FirstOrDefault(t => t.Channel == "Email");

            if (template == null || !campaign.Rules.Any())
                return;

            List<Customer> customers;

            if (campaign.ApplyToAllCustomers)
            {
                customers = await db.Customers.ToListAsync(token);
            }
            else
            {
                customers = await db.CampaignCustomers
                    .Where(cc => cc.CampaignId == campaign.CampaignId && cc.IsActive)
                    .Select(cc => cc.Customer)
                    .ToListAsync(token);
            }

            foreach (var customer in customers)
            {
                if (token.IsCancellationRequested)
                    return;

                // ✅ RULE ENGINE (decides whether campaign runs today)
                var shouldRun = false;

                foreach (var rule in campaign.Rules)
                {
                    if (await ShouldRunForToday(rule, customer, db, today, token))
                    {
                        shouldRun = true;
                        break;
                    }
                }

                if (!shouldRun)
                    continue;


                // 🛑 HARD DEDUP — once per campaign per customer per day
                var logExists = await db.CampaignLogs.AnyAsync(
                    l =>
                        l.CampaignId == campaign.CampaignId &&
                        l.CustomerId == customer.CustomerId &&
                        l.TriggerDate == today,
                    token);

                if (logExists)
                    continue;

                // ❌ Missing email → log skipped
                if (string.IsNullOrWhiteSpace(customer.Email))
                {
                    await InsertLogSafe(db, new CampaignLog
                    {
                        CampaignLogId = Guid.NewGuid(),
                        CampaignId = campaign.CampaignId,
                        CustomerId = customer.CustomerId,
                        TriggerDate = today,
                        Channel = "Email",
                        Status = "Skipped",
                        ErrorMessage = "Customer email is missing"
                    }, token);

                    continue;
                }

                try
                {
                    var subject = ApplyTokens(template.Subject ?? "", customer);
                    var body = ApplyTokens(template.Body ?? "", customer);

                    await emailService.SendAsync(
                        customer.Email,
                        subject,
                        body);

                    await InsertLogSafe(db, new CampaignLog
                    {
                        CampaignLogId = Guid.NewGuid(),
                        CampaignId = campaign.CampaignId,
                        CustomerId = customer.CustomerId,
                        TriggerDate = today,
                        Channel = "Email",
                        Status = "Sent",
                        SentAt = DateTime.UtcNow
                    }, token);
                }
                catch (Exception ex)
                {
                    await InsertLogSafe(db, new CampaignLog
                    {
                        CampaignLogId = Guid.NewGuid(),
                        CampaignId = campaign.CampaignId,
                        CustomerId = customer.CustomerId,
                        TriggerDate = today,
                        Channel = "Email",
                        Status = "Failed",
                        ErrorMessage = ex.Message
                    }, token);
                }
            }
        }

        /* ================= RULE ENGINE ================= */

        private async Task<bool> ShouldRunForToday(
             CampaignRule rule,
             Customer customer,
             AppDbContext db,
             DateTime today,
             CancellationToken token)
        {
            if (rule.Operator == "FixedDate")
            {
                var fixedDate = DateTime.Parse(rule.RuleValue).Date;
                return fixedDate == today;
            }

            if (rule.Operator == "OffsetDays")
            {
                DateTime? baseDate = rule.RuleField switch
                {
                    "DOB" => customer.DOB,
                    "PolicyEndDate" => await GetPolicyEndDateAsync(
                                            db,
                                            customer.CustomerId,
                                            token),
                    _ => null
                };

                if (!baseDate.HasValue)
                    return false;

                var triggerDate =
                    baseDate.Value.Date.AddDays(int.Parse(rule.RuleValue));

                return triggerDate == today;
            }


            return false;
        }

        /* ================= TEMPLATE TOKEN ENGINE ================= */

        private string ApplyTokens(string template, Customer customer)
        {
            return template
                .Replace("@[Name](name)", customer.FullName)
                .Replace("@[Email](email)", customer.Email ?? "")
                .Replace("@[Mobile](mobile)", customer.PrimaryMobile ?? "");
        }

        /* ================= SAFE LOG INSERT ================= */

        private static async Task InsertLogSafe(
            AppDbContext db,
            CampaignLog log,
            CancellationToken token)
        {
            try
            {
                db.CampaignLogs.Add(log);
                await db.SaveChangesAsync(token);
            }
            catch (DbUpdateException)
            {
                // 🔇 Ignore duplicate log insert (unique index protection)
            }
        }
        private async Task<DateTime?> GetPolicyEndDateAsync(
            AppDbContext db,
            Guid customerId,
            CancellationToken token)
        {
            return await db.CustomerPolicies
                .Where(p =>
                    p.CustomerId == customerId &&
                    p.EndDate >= DateTime.UtcNow)
                .OrderBy(p => p.EndDate)
                .Select(p => (DateTime?)p.EndDate)
                .FirstOrDefaultAsync(token);
        }

    }
}
