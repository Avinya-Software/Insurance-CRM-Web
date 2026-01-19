using Avinya.InsuranceCRM.Application.RequestModels;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Interfaces.Insurer
{
    public interface IInsurerService
    {
        Task<ResponseModel> CreateOrUpdateAsync(string advisorId, Guid? companyId, CreateOrUpdateInsurerRequest request);
        Task<ResponseModel> GetPortalPasswordAsync(string advisorId, Guid insurerId);
        Task<ResponseModel> GetFilteredAsync(
            string advisorId,
            string role,
            Guid? companyId,
            string? search,
            int page,
            int pageSize);
        Task<ResponseModel> GetDropdownAsync(string advisorId);
        Task<ResponseModel> DeleteAsync(string advisorId, Guid insurerId);
    }
}
