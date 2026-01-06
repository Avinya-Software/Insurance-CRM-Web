using Avinya.InsuranceCRM.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryInterface
{
    public interface IAdvisorRepository
    {
        Task<Advisor> AddAsync(Advisor advisor);
        Task<Advisor?> GetByUserIdAsync(string userId);

    }
}
