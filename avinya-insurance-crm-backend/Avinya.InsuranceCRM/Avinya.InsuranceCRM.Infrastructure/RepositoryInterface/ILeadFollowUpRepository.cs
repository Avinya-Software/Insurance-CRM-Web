using Avinya.InsuranceCRM.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface ILeadFollowUpRepository
    {
        Task AddAsync(LeadFollowUp followUp);
        Task<List<LeadFollowUp>> GetByLeadIdAsync(Guid leadId);

    }
}
