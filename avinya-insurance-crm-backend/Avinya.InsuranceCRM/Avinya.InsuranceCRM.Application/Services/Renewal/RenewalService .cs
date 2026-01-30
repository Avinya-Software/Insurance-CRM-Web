using Avinya.InsuranceCRM.Application.DTOs.Renewal;
using Avinya.InsuranceCRM.Application.Interfaces.Renewal;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Services.Renewal
{
    public class RenewalService : IRenewalService
    {
        private readonly IRenewalRepository _repo;

        public RenewalService(IRenewalRepository repo)
        {
            _repo = repo;
        }

        public async Task<ResponseModel> UpsertAsync(
            string advisorId,
            Guid? companyId,
            UpsertRenewalDto dto)
        {
            var id = await _repo.UpsertAsync(dto, advisorId, companyId.Value);

            return new ResponseModel(
                200,
                dto.RenewalId.HasValue
                    ? "Renewal updated successfully"
                    : "Renewal created successfully",
                new { RenewalId = id });
        }

        public async Task<ResponseModel> GetPagedAsync(
            string advisorId,
            string role,
            Guid? companyId,
            int pageNumber,
            int pageSize,
            string? search,
            int? statusId)
        {
            var (data, total) = await _repo.GetPagedAsync(
                advisorId, role, companyId, pageNumber, pageSize, search, statusId);

            return new ResponseModel(200, "Renewals fetched successfully", new
            {
                TotalCount = total,
                Page = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(total / (double)pageSize),
                Data = data
            });
        }

        public async Task<ResponseModel> DeleteAsync(string advisorId, Guid renewalId)
            => await _repo.DeleteAsync(renewalId, advisorId)
                ? new ResponseModel(200, "Renewal deleted successfully")
                : new ResponseModel(404, "Renewal not found");

        public async Task<ResponseModel> UpdateStatusAsync(
            string advisorId,
            Guid renewalId,
            int statusId)
            => await _repo.UpdateStatusAsync(advisorId, renewalId, statusId)
                ? new ResponseModel(200, "Renewal status updated successfully")
                : new ResponseModel(404, "Renewal not found");

        public async Task<ResponseModel> GetStatusesAsync()
        {
            var data = await _repo.GetStatusesAsync();
            return new ResponseModel(200, "Statuses fetched successfully", data);
        }
    }
}
