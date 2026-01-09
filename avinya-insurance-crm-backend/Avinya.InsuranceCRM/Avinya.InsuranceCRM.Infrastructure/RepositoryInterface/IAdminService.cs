using Avinya.InsuranceCRM.Application.DTOs.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface IAdminService
    {
        Task<List<PendingAdvisorDto>> GetPendingAdvisorsAsync();
        Task ApproveAdvisorAsync(string userId, string approvedBy);
        Task DisableAdvisorAsync(string userId);
    }

}
