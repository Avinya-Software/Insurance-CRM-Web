using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;
namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface ICustomerRepository
    {
        Task<bool> ExistsByMobileAsync(string mobile);
        Task<bool> ExistsByEmailAsync(string email);
        Task<Customer> AddAsync(Customer customer);
        Task UpdateAsync(Customer customer);
        Task<Customer?> GetByIdAsync(Guid customerId);
        Task<PagedRecordResult<Customer>> GetAllAsync(int pageNumber,int pageSize,string? search);
        Task<bool> DeleteAsync(Guid customerId);
        Task<List<Customer>> GetDropdownAsync();
        Task<bool> ExistsByEmailAsync(string email, Guid excludeCustomerId);
        Task<bool> ExistsByMobileAsync(string mobile, Guid excludeCustomerId);
        Task DeleteByIdAsync(Guid customerId);
    }
}
