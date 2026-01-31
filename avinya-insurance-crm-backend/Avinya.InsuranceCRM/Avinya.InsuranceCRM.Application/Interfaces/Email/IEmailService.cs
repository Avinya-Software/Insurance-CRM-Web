using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Application.Interfaces.Email
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
        Task SendRenewalReminderToAdvisorAsync(
       string advisorEmail,
       string customerName,
       string policyNumber,
       DateTime renewalDate,
       int daysBefore,
       decimal premium);
    }
}
