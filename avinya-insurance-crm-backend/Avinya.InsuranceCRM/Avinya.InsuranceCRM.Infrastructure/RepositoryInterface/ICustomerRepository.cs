using Avinya.InsuranceCRM.API.ResponseModels;
using Avinya.InsuranceCRM.Domain.Entities;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface ICustomerRepository
    {
        /* ================= VALIDATIONS ================= */

        Task<bool> ExistsByMobileAsync(string advisorId, string mobile);
        Task<bool> ExistsByEmailAsync(string advisorId, string email);

        Task<bool> ExistsByEmailAsync(
            string advisorId,
            string email,
            Guid excludeCustomerId);

        Task<bool> ExistsByMobileAsync(
            string advisorId,
            string mobile,
            Guid excludeCustomerId);

        /* ================= CREATE / UPDATE ================= */

        Task<Customer> AddAsync(Customer customer);
        Task UpdateAsync(Customer customer);

        /* ================= READ ================= */

        Task<Customer?> GetByIdAsync(
            string advisorId,
            Guid customerId);

        Task<PagedRecordResult<Customer>> GetAllAsync(
            string advisorId,
            int pageNumber,
            int pageSize,
            string? search);

        Task<List<Customer>> GetDropdownAsync(string advisorId);

        /* ================= DELETE ================= */

        Task<bool> DeleteAsync(
            string advisorId,
            Guid customerId);
    }
}
