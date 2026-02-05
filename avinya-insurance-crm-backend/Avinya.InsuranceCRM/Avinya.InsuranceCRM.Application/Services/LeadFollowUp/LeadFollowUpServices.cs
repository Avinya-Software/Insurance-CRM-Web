using Avinya.InsuranceCRM.Application.DTOs.LeadFollowUp;
using Avinya.InsuranceCRM.Application.Interfaces.LeadFollowUp;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Application.RequestModels;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Services.LeadFollowUp
{
    public class LeadFollowUpServices : ILeadFollowUpServices
    {
        private readonly ILeadFollowUpRepository _repo;

        public LeadFollowUpServices(ILeadFollowUpRepository repo)
        {
            _repo = repo;
        }

        public async Task<ResponseModel> CreateOrUpdateAsync(
    string advisorId,
    CreateLeadFollowUpRequest request)
        {
            if (!Guid.TryParse(advisorId, out var advisorGuid))
                return new ResponseModel(401, "Invalid advisor id");

            var (entity, error) = await _repo.AddOrUpdateAsync(
                request.FollowUpId,
                request.LeadId,
                request.Remark,
                request.NextFollowUpDate,
                request.Status,
                advisorGuid);

            if (error != null)
                return new ResponseModel(400, error);

            var dto = new LeadFollowUpResponseDto
            {
                FollowUpID = entity.FollowUpId,
                LeadID = entity.LeadId,
                Notes = entity.Remark,
                NextFollowupDate = entity.NextFollowUpDate,
                Status = entity.Status,
                FollowUpBy = entity.CreatedBy,
                CreatedDate = entity.CreatedAt
            };

            return new ResponseModel(200, "Follow-up saved successfully", dto);
        }

        public async Task<ResponseModel> GetFollowupHistoryAsync(Guid leadId)
        {
            var (leadExists, followups) = await _repo.GetFollowupHistoryAsync(leadId);

            if (!leadExists)
                return new ResponseModel(404, "Lead not found");

            if (followups == null || !followups.Any())
                return new ResponseModel(200, "No follow-up history found for this lead.");

            return new ResponseModel(200, "Follow-up history fetched successfully", followups);
        }

        public async Task<ResponseModel> GetLeadFollowupStatusesAsync()
    => new ResponseModel(200, "Fetched successfully", await _repo.GetLeadFollowupStatusesAsync());

    }
}
