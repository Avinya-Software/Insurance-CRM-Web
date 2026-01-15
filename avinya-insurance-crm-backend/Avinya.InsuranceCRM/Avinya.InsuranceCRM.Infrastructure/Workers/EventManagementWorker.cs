using Avinya.InsuranceCRM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
namespace Avinya.InsuranceCRM.Infrastructure.Workers
{
    public class EventManagementWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public EventManagementWorker(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // ⏰ Wait until 6:00 AM IST before first run
            await DelayUntilNextSixAM(stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await GenerateEvents(stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    // App shutting down
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[EventManagementWorker] {ex}");
                }

                // ⏱ Run once every 24 hours (next 6 AM IST)
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }

        /* ============================================================
         * MAIN EVENT GENERATION LOGIC
         * ============================================================ */
        private async Task GenerateEvents(CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var today = DateTime.UtcNow.Date;

            /* ============================================================
             * 1️⃣ LEAD FOLLOW-UP DUE TODAY
             * ============================================================ */
            var followUps = await db.LeadFollowUps
                .Include(f => f.Lead)
                .Where(f => f.FollowUpDate.Date == today)
                .ToListAsync(stoppingToken);

            foreach (var followUp in followUps)
            {
                await CreateEventIfNotExists(
                    db,
                    eventType: "FOLLOW_UP_DUE_TODAY",
                    eventDate: today,
                    advisorId: followUp.Lead.AdvisorId,
                    leadId: followUp.LeadId,
                    title: $"Follow-up with {followUp.Lead.FullName}",
                    description: followUp.Remark
                );
            }

            /* ============================================================
             * 2️⃣ POLICY PAYMENT DUE TODAY
             * ============================================================ */
            var paymentDuePolicies = await db.CustomerPolicies
                .Where(p =>
                    !p.PaymentDone &&
                    p.PaymentDueDate.HasValue &&
                    p.PaymentDueDate.Value.Date == today)
                .ToListAsync(stoppingToken);

            foreach (var policy in paymentDuePolicies)
            {
                await CreateEventIfNotExists(
                    db,
                    eventType: "PAYMENT_DUE_TODAY",
                    eventDate: today,
                    advisorId: policy.AdvisorId,
                    policyId: policy.PolicyId,
                    customerId: policy.CustomerId,
                    title: $"Payment due today – {policy.PolicyNumber}",
                    description: $"Amount: ₹{policy.PremiumGross:N2}"
                );
            }

            /* ============================================================
             * 3️⃣ POLICY EXPIRING TODAY (LAST DAY)
             * ============================================================ */
            var expiringPolicies = await db.CustomerPolicies
                .Where(p => p.EndDate.Date == today)
                .ToListAsync(stoppingToken);

            foreach (var policy in expiringPolicies)
            {
                await CreateEventIfNotExists(
                    db,
                    eventType: "POLICY_EXPIRING_TODAY",
                    eventDate: today,
                    advisorId: policy.AdvisorId,
                    policyId: policy.PolicyId,
                    customerId: policy.CustomerId,
                    title: $"Policy expiring today – {policy.PolicyNumber}",
                    description: "Last date of policy coverage"
                );
            }

            /* ============================================================
             * 4️⃣ RENEWAL LAST DATE (T)
             * ============================================================ */
            var renewalsDueToday = await db.Renewals
                .Include(r => r.Policy)
                .Where(r => r.RenewalDate.Date == today)
                .ToListAsync(stoppingToken);

            foreach (var renewal in renewalsDueToday)
            {
                await CreateEventIfNotExists(
                    db,
                    eventType: "RENEWAL_LAST_DAY",
                    eventDate: today,
                    advisorId: renewal.AdvisorId,
                    policyId: renewal.PolicyId,
                    customerId: renewal.CustomerId,
                    title: $"Renewal last day – {renewal.Policy.PolicyNumber}",
                    description: $"Renewal premium: ₹{renewal.RenewalPremium:N2}"
                );
            }

            await db.SaveChangesAsync(stoppingToken);
        }

        /* ============================================================
         * IDENTITY-SAFE EVENT CREATION
         * ============================================================ */
        private static async Task CreateEventIfNotExists(
            AppDbContext db,
            string eventType,
            DateTime eventDate,
            string advisorId,
            Guid? leadId = null,
            Guid? policyId = null,
            Guid? customerId = null,
            string? title = null,
            string? description = null)
        {
            var exists = await db.SystemEvents.AnyAsync(e =>
                e.EventType == eventType &&
                e.EventDate == eventDate &&
                e.LeadId == leadId &&
                e.PolicyId == policyId);

            if (exists)
                return;

            db.SystemEvents.Add(new SystemEvent
            {
                EventType = eventType,
                EventDate = eventDate,
                AdvisorId = advisorId,
                LeadId = leadId,
                PolicyId = policyId,
                CustomerId = customerId,
                Title = title ?? eventType,
                Description = description
            });
        }

        /* ============================================================
         * ⏰ WAIT UNTIL NEXT 6:00 AM IST
         * ============================================================ */
        private static async Task DelayUntilNextSixAM(CancellationToken stoppingToken)
        {
            var utcNow = DateTime.UtcNow;

            var istZone =
                TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");

            var istNow =
                TimeZoneInfo.ConvertTimeFromUtc(utcNow, istZone);

            var nextRun = istNow.Date.AddHours(11).AddMinutes(16); // 6:00 AM IST

            if (istNow >= nextRun)
                nextRun = nextRun.AddDays(1);

            var delay = nextRun - istNow;

            await Task.Delay(delay, stoppingToken);
        }
    }
}
