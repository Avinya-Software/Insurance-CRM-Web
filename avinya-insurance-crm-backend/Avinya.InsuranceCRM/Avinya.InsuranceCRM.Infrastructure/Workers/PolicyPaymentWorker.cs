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
                    // ⏱ Run once every 24 hours
                    await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    // App stopping
                }
            }
        }

        private async Task ProcessPayments(
            CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();

            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);

            /* ============================================================
             * 1️⃣ PAYMENT REMINDER (T-1) – SEND ONLY ONCE
             * ============================================================ */

            var reminderPolicies = await db.CustomerPolicies
                .Include(p => p.Customer)
                .Where(p =>
                    !p.PaymentDone &&
                    p.PaymentDueDate.HasValue &&
                    p.PaymentDueDate.Value.Date == tomorrow &&
                    p.PolicyStatusId != 3 // Not lapsed
                )
                .ToListAsync(stoppingToken);

            foreach (var policy in reminderPolicies)
            {
                if (stoppingToken.IsCancellationRequested)
                    return;

                // ❌ Already reminded
                if (policy.HasPaymentReminderBeenSent("T-1"))
                    continue;

                // 📧 CUSTOMER
                if (!string.IsNullOrWhiteSpace(policy.Customer.Email))
                {
                    await emailService
                        .SendPolicyPaymentReminderToCustomerAsync(
                            policy.Customer.Email,
                            policy.PolicyNumber,
                            policy.PaymentDueDate!.Value,
                            policy.PremiumGross
                        );
                }

                // 📧 ADVISOR
                var advisor = await userManager
                    .FindByIdAsync(policy.Customer.AdvisorId);

                if (!string.IsNullOrWhiteSpace(advisor?.Email))
                {
                    await emailService
                        .SendPolicyPaymentReminderToAdvisorAsync(
                            advisor.Email,
                            policy.PolicyNumber,
                            policy.Customer.FullName,
                            policy.PaymentDueDate!.Value,
                            policy.PremiumGross
                        );
                }

                // ✅ LOG REMINDER
                policy.AddPaymentReminderLog("T-1");
            }

            /* ============================================================
             * 2️⃣ AUTO LAPSE (PAYMENT OVERDUE)
             * ============================================================ */

            var lapsedPolicies = await db.CustomerPolicies
                .Where(p =>
                    !p.PaymentDone &&
                    p.PaymentDueDate.HasValue &&
                    p.PaymentDueDate.Value.Date < today &&
                    p.PolicyStatusId != 3
                )
                .ToListAsync(stoppingToken);

            foreach (var policy in lapsedPolicies)
            {
                policy.PolicyStatusId = 3; // 🔴 Lapsed
                policy.UpdatedAt = DateTime.UtcNow;
            }

            await db.SaveChangesAsync(stoppingToken);
        }
    }
}
