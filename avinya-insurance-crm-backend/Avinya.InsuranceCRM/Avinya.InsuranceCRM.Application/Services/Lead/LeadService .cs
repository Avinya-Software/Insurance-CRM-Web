using Avinya.InsuranceCRM.Application.Interfaces.Lead;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Application.RequestModels;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Services.Lead
{
    public class LeadService : ILeadService
    {
        private readonly ILeadRepository _repo;

        public LeadService(ILeadRepository repo)
        {
            _repo = repo;
        }

        public async Task<ResponseModel> CreateOrUpdateAsync(
            string advisorId,
            Guid? companyId,
            CreateOrUpdateLeadRequest request)
        {
            if (!companyId.HasValue)
                return new ResponseModel(401, "Invalid CompanyId in token");

            var (lead, isUpdate) =
                    await _repo.CreateOrUpdateAsync(advisorId, companyId.Value, request);

                return new ResponseModel(
                    200,
                    isUpdate ? "Lead updated successfully" : "Lead created successfully",
                    new { lead.LeadId, lead.LeadNo });
        }

        public async Task<ResponseModel> GetPagedAsync(
            string advisorId,
            string role,
            Guid? companyId,
            int pageNumber,
            int pageSize,
            string? search,
            string? fullName,
            string? email,
            string? mobile,
            int? leadStatusId,
            int? leadSourceId)
        {
            var (data, totalCount) = await _repo.GetPagedAsync(
                advisorId,
                role,
                companyId,
                pageNumber,
                pageSize,
                search,
                fullName,
                email,
                mobile,
                leadStatusId,
                leadSourceId);

            return new ResponseModel(200, "Leads fetched successfully", new
            {
                TotalCount = totalCount,
                Page = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                Data = data
            });
        }

        public async Task<ResponseModel> DeleteAsync(string advisorId, Guid leadId)
            => await _repo.DeleteAsync(advisorId, leadId)
                ? new ResponseModel(200, "Lead deleted successfully")
                : new ResponseModel(404, "Lead not found");

        public async Task<ResponseModel> GetLeadStatusesAsync()
            => new ResponseModel(200, "Fetched successfully", await _repo.GetLeadStatusesAsync());

        public async Task<ResponseModel> GetLeadSourcesAsync()
            => new ResponseModel(200, "Fetched successfully", await _repo.GetLeadSourcesAsync());

        public async Task<ResponseModel> UpdateStatusAsync(
            string advisorId,
            Guid leadId,
            int statusId,
            string? notes)
            => await _repo.UpdateLeadStatusAsync(advisorId, leadId, statusId, notes)
                ? new ResponseModel(200, "Lead status updated successfully")
                : new ResponseModel(404, "Lead not found");

    }
}
