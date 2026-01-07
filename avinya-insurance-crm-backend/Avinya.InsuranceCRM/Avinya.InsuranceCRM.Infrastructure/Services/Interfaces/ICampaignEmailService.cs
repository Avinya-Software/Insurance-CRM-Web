using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.Services.Interfaces
{
    public interface ICampaignEmailService
    {
        Task SendAsync(
            string toEmail,
            string subject,
            string body);
    }

}
