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
                    Console.WriteLine($"[CampaignWorker] Fatal error: {ex}");
                }

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
                    !string.IsNullOrWhiteSpace(c.AdvisorId) &&
                    (c.StartDate == null || c.StartDate <= today) &&
                    (c.EndDate == null || c.EndDate >= today) &&
                    (
                        // 🔑 CampaignTypeId OR CampaignType fallback
                        new[] { 2, 3, 4, 5 }.Contains(c.CampaignTypeId) ||
                        c.CampaignType == "Birthday" ||
                        c.CampaignType == "Policy Renewal" ||
                        c.CampaignType == "Payment Reminder" ||
                        c.CampaignType == "Policy Expiry"
                    ))
                .Include(c => c.Templates)
                .Include(c => c.Rules)
                .ToListAsync(token);

            foreach (var campaign in campaigns)
            {
                await ExecuteCampaign(campaign, db, emailService, today, token);
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

            // ================= ADVISOR ISOLATION =================

            if (campaign.ApplyToAllCustomers)
            {
                customers = await db.CustomerPolicies
                    .Where(p => p.AdvisorId == campaign.AdvisorId)
                    .Select(p => p.Customer)
                    .Distinct()
                    .ToListAsync(token);
            }
            else
            {
                customers = await db.CampaignCustomers
                    .Where(cc =>
                        cc.CampaignId == campaign.CampaignId &&
                        cc.IsActive &&
                        db.CustomerPolicies.Any(p =>
                            p.CustomerId == cc.CustomerId &&
                            p.AdvisorId == campaign.AdvisorId))
                    .Include(cc => cc.Customer)
                    .Select(cc => cc.Customer)
                    .Distinct()
                    .ToListAsync(token);
            }

            foreach (var customer in customers)
            {
                if (token.IsCancellationRequested)
                    return;

                Console.WriteLine($"[CampaignWorker] Customer={customer.CustomerId}, Email={customer.Email}");

                // ================= RULE ENGINE =================

                var shouldRun = false;

                foreach (var rule in campaign.Rules.Where(r => r.IsActive))
                {
                    if (await ShouldRunForToday(rule, customer, db, today, token))
                    {
                        shouldRun = true;
                        break;
                    }
                }

                if (!shouldRun)
                    continue;

                // ================= HARD DEDUP =================

                var alreadySent = await db.CampaignLogs.AnyAsync(
                    l =>
                        l.CampaignId == campaign.CampaignId &&
                        l.CustomerId == customer.CustomerId &&
                        l.TriggerDate == today,
                    token);

                if (alreadySent)
                    continue;

                // ================= EMAIL CHECK =================

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
                        ErrorMessage = "Customer email missing"
                    }, token);

                    continue;
                }

                try
                {
                    var subject = ApplyTokens(template.Subject ?? "", customer);
                    var body = ApplyTokens(template.Body ?? "", customer);

                    await emailService.SendAsync(customer.Email, subject, body);

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

        /* ================= RULE ENGINE (FINAL) ================= */

        private async Task<bool> ShouldRunForToday(
            CampaignRule rule,
            Customer customer,
            AppDbContext db,
            DateTime today,
            CancellationToken token)
        {
            // ✅ System.Date (FixedDate)
            if (rule.RuleEntity == "System" &&
                rule.RuleField == "Date" &&
                rule.Operator == "FixedDate")
            {
                var fixedDate = DateTime.Parse(rule.RuleValue).Date;
                return fixedDate == today;
            }

            // 🎂 Birthday logic (ignore year)
            if (rule.RuleEntity == "Customer" &&
                rule.RuleField == "DOB" &&
                rule.Operator == "OffsetDays")
            {
                if (!customer.DOB.HasValue)
                    return false;

                var dobThisYear = new DateTime(
                    today.Year,
                    customer.DOB.Value.Month,
                    customer.DOB.Value.Day);

                var triggerDate = dobThisYear
                    .AddDays(int.Parse(rule.RuleValue));

                return triggerDate == today;
            }

            // 🔁 Policy-based rules
            DateTime? baseDate = rule.RuleEntity switch
            {
                "Policy" when rule.RuleField == "EndDate" =>
                    await db.CustomerPolicies
                        .Where(p => p.CustomerId == customer.CustomerId)
                        .OrderBy(p => p.EndDate)
                        .Select(p => (DateTime?)p.EndDate)
                        .FirstOrDefaultAsync(token),

                "Policy" when rule.RuleField == "PaymentDueDate" =>
                    await db.CustomerPolicies
                        .Where(p => p.CustomerId == customer.CustomerId &&
                                    p.PaymentDueDate != null)
                        .OrderBy(p => p.PaymentDueDate)
                        .Select(p => (DateTime?)p.PaymentDueDate)
                        .FirstOrDefaultAsync(token),

                "Policy" when rule.RuleField == "RenewalDate" =>
                    await db.CustomerPolicies
                        .Where(p => p.CustomerId == customer.CustomerId &&
                                    p.RenewalDate != null)
                        .OrderBy(p => p.RenewalDate)
                        .Select(p => (DateTime?)p.RenewalDate)
                        .FirstOrDefaultAsync(token),

                _ => null
            };

            if (!baseDate.HasValue)
                return false;

            var finalTrigger = baseDate.Value.Date
                .AddDays(int.Parse(rule.RuleValue));

            return finalTrigger == today;
        }

        /* ================= TEMPLATE TOKENS ================= */

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
                // ignore duplicates
            }
        }
    }
}
