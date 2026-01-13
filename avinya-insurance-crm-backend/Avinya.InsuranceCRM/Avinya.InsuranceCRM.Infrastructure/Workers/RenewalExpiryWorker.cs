//using Avinya.InsuranceCRM.Infrastructure.Persistence;
//using Avinya.InsuranceCRM.Infrastructure.Services.Interfaces;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.DependencyInjection;
//using Microsoft.Extensions.Hosting;

//namespace Avinya.InsuranceCRM.Infrastructure.Workers
//{
//    public class RenewalExpiryWorker : BackgroundService
//    {
//        private readonly IServiceScopeFactory _scopeFactory;

//        public RenewalExpiryWorker(IServiceScopeFactory scopeFactory)
//        {
//            _scopeFactory = scopeFactory;
//        }

//        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
//        {
//            while (!stoppingToken.IsCancellationRequested)
//            {
//                try
//                {
//                    await ProcessRenewals(stoppingToken);
//                }
//                catch (OperationCanceledException)
//                {
//                    // Normal shutdown → ignore
//                }
//                catch (Exception ex)
//                {
//                    Console.WriteLine($"[RenewalExpiryWorker] {ex}");
//                }

//                try
//                {
//                    await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
//                }
//                catch (OperationCanceledException)
//                {
//                    // App stopping
//                }
//            }
//        }

//        private async Task ProcessRenewals(CancellationToken stoppingToken)
//        {
//            using var scope = _scopeFactory.CreateScope();

//            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

//            var today = DateTime.UtcNow.Date;
//            var tomorrow = today.AddDays(1);

//            // 🔔 T-1 Reminder
//            var reminderRenewals = await db.Renewals
//                .Include(r => r.Customer)
//                .Include(r => r.Policy)
//                .Where(r =>
//                    r.RenewalStatusId == 1 &&
//                    r.RenewalDate.Date == tomorrow
//                )
//                .ToListAsync(stoppingToken);

//            foreach (var renewal in reminderRenewals)
//            {
//                if (string.IsNullOrWhiteSpace(renewal.Customer.Email))
//                    continue;

//                await emailService.SendRenewalExpiryReminderAsync(
//                    renewal.Customer.Email,
//                    renewal.Policy.PolicyNumber,
//                    renewal.RenewalDate,
//                    renewal.RenewalPremium
//                );
//            }

//            // 🔴 Auto mark lost
//            var expiredRenewals = await db.Renewals
//                .Where(r =>
//                    r.RenewalStatusId == 1 &&
//                    r.RenewalDate.Date < today
//                )
//                .ToListAsync(stoppingToken);

//            foreach (var renewal in expiredRenewals)
//            {
//                renewal.RenewalStatusId = 3;
//                renewal.UpdatedAt = DateTime.UtcNow;
//            }

//            await db.SaveChangesAsync(stoppingToken);
//        }
//    }
//}
