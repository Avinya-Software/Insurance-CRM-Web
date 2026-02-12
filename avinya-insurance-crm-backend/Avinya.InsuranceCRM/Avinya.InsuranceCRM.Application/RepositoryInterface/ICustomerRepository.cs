using Avinya.InsuranceCRM.Application.DTOs;
using Avinya.InsuranceCRM.Application.DTOs.KYCFIle;
using Avinya.InsuranceCRM.Application.RequestModels;
using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface ICustomerRepository
    {
        Task<(Customer customer, bool isUpdate)> CreateOrUpdateAsync(
            string advisorId,
            Guid? companyId,
            CreateCustomerRequest request);

        Task<(IEnumerable<CustomerListDto> Data, int TotalCount)> GetPagedAsync(
            string advisorId,
            string role,
            Guid? companyId,
            int pageNumber,
            int pageSize,
            string? search);

        Task<bool> DeleteAsync(string advisorId, Guid customerId);
        Task<List<Customer>> GetDropdownAsync(string advisorId);
        Task<bool> DeleteKycFileAsync(string advisorId, Guid customerId, string documentId);
        string? GetKycFilePath(Guid customerId, string documentId);

    }
}
