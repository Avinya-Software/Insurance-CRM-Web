using Avinya.InsuranceCRM.Application.DTOs.Admin;
using Avinya.InsuranceCRM.Infrastructure.Identity;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class AdminService : IAdminService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAdvisorRepository _advisorRepo;

        public AdminService(
            UserManager<ApplicationUser> userManager,
            IAdvisorRepository advisorRepo)
        {
            _userManager = userManager;
            _advisorRepo = advisorRepo;
        }

        public async Task<List<PendingAdvisorDto>> GetPendingAdvisorsAsync()
        {
            var users = _userManager.Users
                .Where(u => !u.IsApproved && u.IsActive)
                .ToList();

            var result = new List<PendingAdvisorDto>();

            foreach (var user in users)
            {
                var advisor = await _advisorRepo.GetByUserIdAsync(user.Id);
                if (advisor != null)
                {
                    result.Add(new PendingAdvisorDto
                    {
                        UserId = user.Id,
                        AdvisorId = advisor.AdvisorId,
                        FullName = advisor.FullName,
                        Email = user.Email!
                    });
                }
            }

            return result;
        }

        public async Task ApproveAdvisorAsync(string userId, string approvedBy)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            user.IsApproved = true;
            user.ApprovedAt = DateTime.UtcNow;
            user.ApprovedBy = approvedBy;

            await _userManager.UpdateAsync(user);
        }

        public async Task DisableAdvisorAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            user.IsActive = false;
            await _userManager.UpdateAsync(user);
        }
    }

}
