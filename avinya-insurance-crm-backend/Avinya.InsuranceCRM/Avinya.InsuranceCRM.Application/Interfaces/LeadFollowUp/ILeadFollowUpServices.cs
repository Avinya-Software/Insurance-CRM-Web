using Avinya.InsuranceCRM.Application.RequestModels;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Interfaces.LeadFollowUp
{
    public interface ILeadFollowUpServices
    {
        Task<ResponseModel> CreateOrUpdateAsync(
    string advisorId,
    CreateLeadFollowUpRequest request);

        Task<ResponseModel> GetFollowupHistoryAsync(Guid leadId);
        Task<ResponseModel> GetLeadFollowupStatusesAsync();
    }
}
