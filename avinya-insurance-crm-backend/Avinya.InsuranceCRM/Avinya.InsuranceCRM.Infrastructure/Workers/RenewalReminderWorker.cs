using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Avinya.InsuranceCRM.Infrastructure.Services.Interfaces;
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
            while (!stoppingToken.IsCancellationRequested)
            {
                await ProcessReminders(stoppingToken);

                // Runs once every 24 hours
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }

        private async Task ProcessReminders(
            CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();

            var db = scope.ServiceProvider
                .GetRequiredService<AppDbContext>();

            var emailService = scope.ServiceProvider
                .GetRequiredService<IEmailService>();

            var today = DateTime.UtcNow.Date;

            var renewals = db.Renewals
                .Where(r => r.RenewalDate >= today)
                .ToList();

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

                    // ✅ SEND EMAIL
                    await emailService.SendRenewalReminderAsync(
                        renewal.CustomerId,
                        renewal.PolicyId,
                        renewal.RenewalDate,
                        days,
                        renewal.RenewalPremium
                    );

                    // ✅ LOG REMINDER (DOMAIN METHOD)
                    renewal.AddReminderLog(days, "Email");
                }
            }

            await db.SaveChangesAsync(stoppingToken);
        }
    }
}
