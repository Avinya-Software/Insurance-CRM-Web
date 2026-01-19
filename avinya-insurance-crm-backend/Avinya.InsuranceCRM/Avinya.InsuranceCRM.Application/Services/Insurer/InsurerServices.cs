using Avinya.InsuranceCRM.Application.Interfaces.Insurer;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using VaraPrints.Application.Models;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.API.Helper;

namespace Avinya.InsuranceCRM.Application.Services.Insurers
{
    public class InsurerServices : IInsurerService
    {
        private readonly IInsurerRepository _repo;

        public InsurerServices(IInsurerRepository repo)
        {
            _repo = repo;
        }

        public async Task<ResponseModel> CreateOrUpdateAsync(
            string advisorId,
            Guid? companyId,
            CreateOrUpdateInsurerRequest request)
        {
                if (!companyId.HasValue)
                    return new ResponseModel(401, "Invalid CompanyId in token");

                var (insurer, isUpdate) =
                    await _repo.CreateOrUpdateAsync(advisorId, companyId.Value, request);

                var message = isUpdate
                    ? "Insurer updated successfully"
                    : "Insurer created successfully";

                return new ResponseModel(200, message, insurer);
        }


        public async Task<ResponseModel> GetPortalPasswordAsync(string advisorId, Guid insurerId)
        {

                if (string.IsNullOrEmpty(advisorId))
                    return new ResponseModel(401, "Advisor not found in token");

                var insurer = await _repo.GetByIdAsync(advisorId, insurerId);
                if (insurer == null || insurer.PortalPassword == null)
                    return new ResponseModel(404, "Password not found");

                return new ResponseModel(200, "Password fetched successfully", new
                {
                    password = EncryptionHelper.Decrypt(insurer.PortalPassword)
                });
            }

        public async Task<ResponseModel> GetFilteredAsync(
            string advisorId,
            string role,
            Guid? companyId,
            string? search,

            int page,
            int pageSize)
        {
                if (string.IsNullOrEmpty(advisorId))
                    return new ResponseModel(401, "Advisor not found in token");

                var (insurers, totalCount) =
                    await _repo.GetFilteredAsync(
                        advisorId,
                        role,
                        companyId,
                        search,
                        page,
                        pageSize);

                return new ResponseModel(
                    200,
                    "Insurers fetched successfully",
                    new
                    {
                        TotalCount = totalCount,
                        Page = page,
                        PageSize = pageSize,
                        TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                        Data = insurers
                    });
            }


        public async Task<ResponseModel> GetDropdownAsync(string advisorId)
        {

                if (string.IsNullOrEmpty(advisorId))
                    return new ResponseModel(401, "Advisor not found in token");

                var insurers = await _repo.GetDropdownAsync(advisorId);
                return new ResponseModel(200, "Dropdown fetched successfully", insurers);
        }
            

        public async Task<ResponseModel> DeleteAsync(string advisorId, Guid insurerId)
        {

                if (string.IsNullOrEmpty(advisorId))
                    return new ResponseModel(401, "Advisor not found in token");

                var deleted = await _repo.DeleteAsync(advisorId, insurerId);
                if (!deleted) return new ResponseModel(404, "Insurer not found");

                return new ResponseModel(200, "Insurer deleted successfully");
            }
    }
}
