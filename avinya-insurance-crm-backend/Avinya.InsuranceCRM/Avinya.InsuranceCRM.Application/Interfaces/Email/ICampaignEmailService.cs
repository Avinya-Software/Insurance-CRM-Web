using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Application.Interfaces.Email
{
    public interface ICampaignEmailService
    {
        Task SendAsync(
            string toEmail,
            string subject,
            string body);
    }

}
