using Avinya.InsuranceCRM.Domain.Entities;
namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface IAdvisorRepository
    {
        Task<Advisor> AddAsync(Advisor advisor);
        Task<Advisor?> GetByUserIdAsync(string userId);

    }
}
