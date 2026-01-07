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

                // ⏱ Change to Minutes for testing if needed
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
            // 🎯 Only Birthday campaign for now
            if (!campaign.CampaignType.Equals("Birthday", StringComparison.OrdinalIgnoreCase))
                return;

            var template = campaign.Templates
                .FirstOrDefault(t => t.Channel == "Email");

            if (template == null)
                return;

            var customers = await db.Customers
                .ToListAsync(token);

            foreach (var customer in customers)
            {
                if (token.IsCancellationRequested)
                    return;

                // ❌ DOB missing
                if (!customer.DOB.HasValue)
                    continue;

                // 🎂 Birthday check (day + month)
                if (customer.DOB.Value.Day != today.Day ||
                    customer.DOB.Value.Month != today.Month)
                    continue;

                // 🛑 HARD DEDUP — if ANY log exists for today, skip
                var logExists = await db.CampaignLogs.AnyAsync(
                    l =>
                        l.CampaignId == campaign.CampaignId &&
                        l.CustomerId == customer.CustomerId &&
                        l.TriggerDate == today,
                    token);

                if (logExists)
                    continue;

                // ❌ Missing email → log SKIPPED
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
                    // 🎯 Replace placeholders in SUBJECT + BODY
                    var subject = (template.Subject ?? "Happy Birthday 🎉")
                        .Replace("{{CustomerName}}", customer.FullName);

                    var body = template.Body
                        .Replace("{{CustomerName}}", customer.FullName);

                    // 📤 SEND EMAIL
                    await emailService.SendAsync(
                        customer.Email,
                        subject,
                        body);

                    // ✅ LOG SENT (IMMEDIATE SAVE)
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
                    // ❌ LOG FAILED (IMMEDIATE SAVE)
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
    }
}
