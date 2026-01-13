using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Avinya.InsuranceCRM.API.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetDashboardOverview()
        {
            var advisorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(advisorId))
                return Unauthorized();

            /* ================= BASE QUERIES ================= */

            var leadsQuery = _context.Leads.Where(x => x.AdvisorId == advisorId);
            var customersQuery = _context.Customers.Where(x => x.AdvisorId == advisorId);
            var policiesQuery = _context.CustomerPolicies.Where(x => x.AdvisorId == advisorId);
            var renewalsQuery = _context.Renewals.Where(x => x.AdvisorId == advisorId);
            var claimsQuery = _context.Claims.Where(x => x.AdvisorId == advisorId);

            /* ================= LEADS ================= */

            var totalLeads = await leadsQuery.CountAsync();
            var convertedLeads = await leadsQuery.CountAsync(x => x.IsConverted);
            var lostLeads = await leadsQuery.CountAsync(x => x.LeadStatus.StatusName == "Lost");

            /* ================= CUSTOMERS ================= */

            var totalCustomers = await customersQuery.CountAsync();

            /* ================= POLICIES ================= */

            var totalPolicies = await policiesQuery.CountAsync();
            var activePolicies = await policiesQuery.CountAsync(x => x.PolicyStatus.StatusName == "Active");
            var lapsedPolicies = await policiesQuery.CountAsync(x => x.PolicyStatus.StatusName == "Lapsed");

            var paidPolicies = await policiesQuery.CountAsync(x => x.PaymentDone);
            var unpaidPolicies = await policiesQuery.CountAsync(x => !x.PaymentDone);

            var collectedPremium = await policiesQuery
                .Where(x => x.PaymentDone)
                .SumAsync(x => (decimal?)x.PremiumGross) ?? 0;

            var pendingPremium = await policiesQuery
                .Where(x => !x.PaymentDone)
                .SumAsync(x => (decimal?)x.PremiumGross) ?? 0;

            /* ================= RENEWALS ================= */

            var pendingRenewals = await renewalsQuery.CountAsync(x => x.RenewalStatus.StatusName == "Pending");
            var renewedPolicies = await renewalsQuery.CountAsync(x => x.RenewalStatus.StatusName == "Renewed");
            var lostRenewals = await renewalsQuery.CountAsync(x => x.RenewalStatus.StatusName == "Lost");

            var renewalPremium = await renewalsQuery
                .SumAsync(x => (decimal?)x.RenewalPremium) ?? 0;

            /* ================= CLAIMS ================= */

            var totalClaims = await claimsQuery.CountAsync();
            var approvedClaims = await claimsQuery.CountAsync(x => x.ClaimStage.StageName == "Approved");
            var rejectedClaims = await claimsQuery.CountAsync(x => x.ClaimStage.StageName == "Rejected");

            var totalClaimAmount = await claimsQuery
                .SumAsync(x => (decimal?)x.ClaimAmount) ?? 0;

            var approvedClaimAmount = await claimsQuery
                .SumAsync(x => (decimal?)x.ApprovedAmount) ?? 0;

            /* ================= MONTHLY POLICY TREND ================= */

            var monthlyPolicyRaw = await policiesQuery
                .GroupBy(x => new { x.CreatedAt.Year, x.CreatedAt.Month })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    Policies = g.Count(),
                    PaidPremium = g.Where(x => x.PaymentDone).Sum(x => x.PremiumGross),
                    PendingPremium = g.Where(x => !x.PaymentDone).Sum(x => x.PremiumGross)
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync();

            var monthlyPolicyTrend = monthlyPolicyRaw.Select(x => new
            {
                Month = $"{x.Year}-{x.Month:D2}",
                x.Policies,
                x.PaidPremium,
                x.PendingPremium
            });

            /* ================= PRODUCT WISE SALES (PAID ONLY) ================= */

            var productWiseSales = await policiesQuery
                .Where(x => x.PaymentDone)
                .GroupBy(x => x.Product.ProductName)
                .Select(g => new
                {
                    Product = g.Key,
                    Policies = g.Count(),
                    Premium = g.Sum(x => x.PremiumGross)
                })
                .OrderByDescending(x => x.Premium)
                .ToListAsync();

            /* ================= CLAIM STAGE BREAKUP ================= */

            var claimStageBreakup = await claimsQuery
                .GroupBy(x => x.ClaimStage.StageName)
                .Select(g => new
                {
                    Stage = g.Key,
                    Count = g.Count(),
                    Amount = g.Sum(x => x.ClaimAmount)
                })
                .ToListAsync();

            /* ================= RESPONSE ================= */

            return Ok(new
            {
                Leads = new
                {
                    Total = totalLeads,
                    Converted = convertedLeads,
                    Lost = lostLeads,
                    ConversionRate = totalLeads == 0
                        ? 0
                        : Math.Round((decimal)convertedLeads / totalLeads * 100, 2)
                },

                Customers = new
                {
                    Total = totalCustomers
                },

                Policies = new
                {
                    Total = totalPolicies,
                    Active = activePolicies,
                    Lapsed = lapsedPolicies,
                    Paid = paidPolicies,
                    Unpaid = unpaidPolicies,
                    CollectedPremium = collectedPremium,
                    PendingPremium = pendingPremium
                },

                Renewals = new
                {
                    Pending = pendingRenewals,
                    Renewed = renewedPolicies,
                    Lost = lostRenewals,
                    RenewalPremium = renewalPremium
                },

                Claims = new
                {
                    Total = totalClaims,
                    Approved = approvedClaims,
                    Rejected = rejectedClaims,
                    TotalAmount = totalClaimAmount,
                    ApprovedAmount = approvedClaimAmount
                },

                Charts = new
                {
                    MonthlyPolicyTrend = monthlyPolicyTrend,
                    ProductWiseSales = productWiseSales,
                    ClaimStageBreakup = claimStageBreakup
                }
            });
        }   
    }
}
