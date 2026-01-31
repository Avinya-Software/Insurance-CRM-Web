namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface IEmailRepository
    {
        Task<string?> GetCustomerEmailAsync(Guid customerId);
        Task<string?> GetCustomerNameAsync(Guid customerId);
    }
}
