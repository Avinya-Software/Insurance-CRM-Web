using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendRenewalReminderAsync(
            Guid customerId,
            Guid policyId,
            DateTime renewalDate,
            int daysBefore,
            decimal premium);

        Task SendAdvisorApprovalEmailAsync(string email);

        Task SendAdvisorRejectionEmailAsync(string email);
        Task SendPolicyPaymentReminderToCustomerAsync(
           string customerEmail,
           string policyNumber,
           DateTime dueDate,
           decimal premium
         );

        Task SendPolicyCancellationWarningToCustomerAsync(
            string customerEmail,
            string policyNumber,
            DateTime dueDate,
            decimal premium
        );

        /* ================= ADVISOR ================= */

        Task SendPolicyPaymentReminderToAdvisorAsync(
            string advisorEmail,
            string policyNumber,
            string customerName,
            DateTime dueDate,
            decimal premium
        );

        Task SendPolicyCancellationWarningToAdvisorAsync(
            string advisorEmail,
            string policyNumber,
            string customerName,
            DateTime dueDate,
            decimal premium
        );
        Task SendRenewalExpiryReminderAsync(
            string toEmail,
            string policyNumber,
            DateTime renewalDate,
            decimal premium
        );

    }
}
