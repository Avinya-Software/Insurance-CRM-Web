using Avinya.InsuranceCRM.Infrastructure.Identity;
using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Avinya.InsuranceCRM.Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json;

namespace Avinya.InsuranceCRM.Infrastructure.Workers
{
    public class RenewalReminderWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public RenewalReminderWorker(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(
            CancellationToken stoppingToken)
        {
            // ⏰ FIRST RUN → wait until next 8 AM IST
            await DelayUntilNextEightAM(stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessReminders(stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    // Normal shutdown
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[RenewalReminderWorker] {ex}");
                }

                try
                {
                    // ⏱ Run again after 24 hours (next 8 AM)
                    await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    // App stopping
                }
            }
        }

        private async Task ProcessReminders(
            CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();

            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            var today = DateTime.UtcNow.Date;

            var renewals = await db.Renewals
                .Include(r => r.Customer)
                .Include(r => r.Policy)
                .Where(r => r.RenewalDate >= today)
                .ToListAsync(stoppingToken);

            foreach (var renewal in renewals)
            {
                if (string.IsNullOrWhiteSpace(renewal.ReminderDatesJson))
                    continue;

                var reminderDays =
                    JsonSerializer.Deserialize<List<int>>(
                        renewal.ReminderDatesJson) ?? new List<int>();

                foreach (var days in reminderDays)
                {
                    if (stoppingToken.IsCancellationRequested)
                        return;

                    var reminderDate =
                        renewal.RenewalDate.AddDays(-days).Date;

                    // ❌ Not today
                    if (reminderDate != today)
                        continue;

                    // ❌ Already sent
                    if (renewal.HasReminderBeenSent(days))
                        continue;

                    /* ================= CUSTOMER EMAIL ================= */
                    if (!string.IsNullOrWhiteSpace(renewal.Customer.Email))
                    {
                        await emailService.SendRenewalReminderAsync(
                            renewal.CustomerId,
                            renewal.PolicyId,
                            renewal.RenewalDate,
                            days,
                            renewal.RenewalPremium
                        );
                    }

                    /* ================= ADVISOR EMAIL ================= */
                    var advisor = await userManager
                        .FindByIdAsync(renewal.Customer.AdvisorId);

                    if (!string.IsNullOrWhiteSpace(advisor?.Email))
                    {
                        await emailService.SendRenewalReminderToAdvisorAsync(
                            advisor.Email,
                            renewal.Customer.FullName,
                            renewal.Policy.PolicyNumber,
                            renewal.RenewalDate,
                            days,
                            renewal.RenewalPremium
                        );
                    }

                    // ✅ LOG REMINDER (ONCE PER DAY PER RULE)
                    renewal.AddReminderLog(days, "Email");
                }
            }

            await db.SaveChangesAsync(stoppingToken);
        }

        /* ============================================================
         * ⏰ HELPER: WAIT UNTIL NEXT 8 AM (IST)
         * ============================================================ */
        private static async Task DelayUntilNextEightAM(
            CancellationToken stoppingToken)
        {
            var utcNow = DateTime.UtcNow;

            var istZone =
                TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");

            var istNow =
                TimeZoneInfo.ConvertTimeFromUtc(utcNow, istZone);

            var nextRun = istNow.Date.AddHours(8); // 8:00 AM IST

            if (istNow >= nextRun)
                nextRun = nextRun.AddDays(1);

            var delay = nextRun - istNow;

            await Task.Delay(delay, stoppingToken);
        }
    }
}
