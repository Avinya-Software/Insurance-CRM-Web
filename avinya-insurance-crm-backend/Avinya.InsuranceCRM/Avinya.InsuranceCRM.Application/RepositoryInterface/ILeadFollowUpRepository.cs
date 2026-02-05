using Avinya.InsuranceCRM.Application.DTOs;
using Avinya.InsuranceCRM.Application.DTOs.LeadFollowUp;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface ILeadFollowUpRepository
    {
        Task<(LeadFollowUp? Data, string? Error)> AddOrUpdateAsync(
                Guid? followUpId,
                Guid leadId,
                string? notes,
                DateTime nextFollowupDate,
                int status,
                Guid advisorId);

        Task<(bool leadExists, List<LeadFollowupDTO>? followups)> GetFollowupHistoryAsync(Guid leadId);

        Task<List<LeadFollowupStatus>> GetLeadFollowupStatusesAsync();

    }
}
