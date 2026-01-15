using Avinya.InsuranceCRM.Infrastructure.Identity;
using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Avinya.InsuranceCRM.Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Avinya.InsuranceCRM.Infrastructure.Workers
{
    public class PolicyPaymentWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public PolicyPaymentWorker(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(
            CancellationToken stoppingToken)
        {
            // ⏰ FIRST: wait until next 8 AM IST
            await DelayUntilNextEightAM(stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessPayments(stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    // Normal shutdown
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[PolicyPaymentWorker] {ex}");
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

        private async Task ProcessPayments(CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();

            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);

            /* ============================================================
             * 1️⃣ T – PAYMENT DUE TODAY (URGENT WARNING)
             * ============================================================ */

            var dueTodayPolicies = await db.CustomerPolicies
                .Include(p => p.Customer)
                .Where(p =>
                    !p.PaymentDone &&
                    p.PaymentDueDate.HasValue &&
                    p.PaymentDueDate.Value.Date == today &&
                    p.PolicyStatusId != 3
                )
                .ToListAsync(stoppingToken);

            foreach (var policy in dueTodayPolicies)
            {
                if (policy.HasPaymentReminderBeenSent("T"))
                    continue;

                // 📧 CUSTOMER
                if (!string.IsNullOrWhiteSpace(policy.Customer.Email))
                {
                    await emailService.SendPolicyCancellationWarningToCustomerAsync(
                        policy.Customer.Email,
                        policy.PolicyNumber,
                        policy.PaymentDueDate!.Value,
                        policy.PremiumGross
                    );
                }

                // 📧 ADVISOR
                var advisor = await userManager.FindByIdAsync(policy.Customer.AdvisorId);

                if (!string.IsNullOrWhiteSpace(advisor?.Email))
                {
                    await emailService.SendPolicyCancellationWarningToAdvisorAsync(
                        advisor.Email,
                        policy.PolicyNumber,
                        policy.Customer.FullName,
                        policy.PaymentDueDate!.Value,
                        policy.PremiumGross
                    );
                }

                policy.AddPaymentReminderLog("T");
            }

            /* ============================================================
             * 2️⃣ T+1 – PAYMENT OVERDUE → FINAL WARNING + LAPSE
             * ============================================================ */

            var overduePolicies = await db.CustomerPolicies
                .Include(p => p.Customer)
                .Where(p =>
                    !p.PaymentDone &&
                    p.PaymentDueDate.HasValue &&
                    p.PaymentDueDate.Value.Date == tomorrow.AddDays(-1) && // yesterday
                    p.PolicyStatusId != 3
                )
                .ToListAsync(stoppingToken);

            foreach (var policy in overduePolicies)
            {
                if (!policy.HasPaymentReminderBeenSent("T+1"))
                {
                    // 📧 CUSTOMER
                    if (!string.IsNullOrWhiteSpace(policy.Customer.Email))
                    {
                        await emailService.SendPolicyCancellationWarningToCustomerAsync(
                            policy.Customer.Email,
                            policy.PolicyNumber,
                            policy.PaymentDueDate!.Value,
                            policy.PremiumGross
                        );
                    }

                    // 📧 ADVISOR
                    var advisor = await userManager.FindByIdAsync(policy.Customer.AdvisorId);

                    if (!string.IsNullOrWhiteSpace(advisor?.Email))
                    {
                        await emailService.SendPolicyCancellationWarningToAdvisorAsync(
                            advisor.Email,
                            policy.PolicyNumber,
                            policy.Customer.FullName,
                            policy.PaymentDueDate!.Value,
                            policy.PremiumGross
                        );
                    }

                    policy.AddPaymentReminderLog("T+1");
                }

                // 🔴 AUTO LAPSE
                policy.PolicyStatusId = 3;
                policy.UpdatedAt = DateTime.UtcNow;
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

            // 🇮🇳 India Standard Time
            var istZone =
                TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");

            var istNow =
                TimeZoneInfo.ConvertTimeFromUtc(utcNow, istZone);

            var nextRun = istNow.Date.AddHours(10).AddMinutes(11); // 10:30 AM

            if (istNow >= nextRun)
                nextRun = nextRun.AddDays(1);

            var delay = nextRun - istNow;

            await Task.Delay(delay, stoppingToken);
        }
    }
}
