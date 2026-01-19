using Avinya.InsuranceCRM.Domain.Entities;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Application.RepositoryInterface
{
    public interface ILeadFollowUpRepository
    {
        Task AddAsync(LeadFollowUp followUp);
        Task<IDbContextTransaction> BeginTransactionAsync();

    }
}
