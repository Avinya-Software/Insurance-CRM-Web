using Avinya.InsuranceCRM.Application.RequestModels;
using Microsoft.AspNetCore.Mvc;
using VaraPrints.Application.Models;

namespace Avinya.InsuranceCRM.Application.Interfaces.Customer
{
    public interface ICustomerServices
    {
        Task<ResponseModel> CreateOrUpdateAsync(string advisorId, Guid? companyId, CreateCustomerRequest request);
        Task<ResponseModel> GetPagedAsync(string advisorId, string role,Guid? companyId, int pageNumber, int pageSize, string? search);
        Task<ResponseModel> DeleteAsync(string advisorId, Guid customerId);
        Task<ResponseModel> GetDropdownAsync(string advisorId);
        Task<ResponseModel> DeleteKycAsync(string advisorId, Guid customerId, string documentId);
        IActionResult PreviewKyc(Guid customerId, string documentId);
        IActionResult DownloadKyc(Guid customerId, string documentId);
    }
}
