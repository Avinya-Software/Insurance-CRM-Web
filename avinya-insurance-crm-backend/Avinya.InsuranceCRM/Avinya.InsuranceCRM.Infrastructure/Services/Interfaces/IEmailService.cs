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
    }
}
