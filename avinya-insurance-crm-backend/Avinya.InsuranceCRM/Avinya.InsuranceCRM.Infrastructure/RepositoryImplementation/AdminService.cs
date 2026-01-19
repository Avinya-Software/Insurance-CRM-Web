using Avinya.InsuranceCRM.Application.DTOs.Admin;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Identity;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class AdminService : IAdminService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAdvisorRepository _advisorRepo;
        private readonly AppDbContext _db;

        public AdminService(
            UserManager<ApplicationUser> userManager,
            IAdvisorRepository advisorRepo,
            AppDbContext db)
        {
            _userManager = userManager;
            _advisorRepo = advisorRepo;
            _db = db;
        }

        /* ================= PENDING ADVISORS ================= */

        public async Task<List<PendingAdvisorDto>> GetPendingAdvisorsAsync()
        {
            var users = await _userManager.Users
                .Where(u => !u.IsApproved && u.IsActive)
                .ToListAsync();

            var result = new List<PendingAdvisorDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                if (!roles.Contains("Advisor"))
                    continue;

                var advisor = await _advisorRepo.GetByUserIdAsync(user.Id);
                if (advisor == null)
                    continue;

                result.Add(new PendingAdvisorDto
                {
                    UserId = user.Id,
                    AdvisorId = advisor.AdvisorId,
                    FullName = advisor.FullName,
                    Email = user.Email!
                });
            }

            return result;
        }

        /* ================= PENDING COMPANIES ================= */

        public async Task<List<PendingCompanyDto>> GetPendingCompaniesAsync()
        {
            var pendingAdmins = await _userManager.Users
                .Where(u =>
                    u.CompanyId != null &&
                    !u.IsApproved &&
                    u.IsActive)
                .ToListAsync();

            var result = new List<PendingCompanyDto>();

            foreach (var user in pendingAdmins)
            {
                var roles = await _userManager.GetRolesAsync(user);
                if (!roles.Contains("CompanyAdmin"))
                    continue;

                var company = await _db.Companies.FindAsync(user.CompanyId);
                if (company == null)
                    continue;

                result.Add(new PendingCompanyDto
                {
                    CompanyId = company.CompanyId,
                    CompanyName = company.CompanyName,
                    AdminUserId = user.Id,
                    AdminEmail = user.Email!,
                    CreatedAt = company.CreatedAt
                });
            }

            return result;
        }

        /* ================= APPROVE USER (Advisor / CompanyAdmin) ================= */

        public async Task ApproveUserAsync(string userId, string approvedBy)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            user.IsApproved = true;
            user.ApprovedAt = DateTime.UtcNow;
            user.ApprovedBy = approvedBy;

            await _userManager.UpdateAsync(user);
        }

        /* ================= DISABLE USER ================= */

        public async Task DisableUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            user.IsActive = false;
            await _userManager.UpdateAsync(user);
        }

        /* ================= ADVISORS BY STATUS ================= */

        public async Task<List<AdvisorStatusDto>> GetAdvisorsByStatusAsync(
            string status,
            DateTime? fromDate,
            DateTime? toDate)
        {
            var users = _userManager.Users.AsQueryable();

            if (status == "approved")
            {
                users = users.Where(u => u.IsApproved && u.IsActive);

                if (fromDate.HasValue)
                    users = users.Where(u => u.ApprovedAt >= fromDate);

                if (toDate.HasValue)
                    users = users.Where(u => u.ApprovedAt <= toDate);
            }
            else if (status == "rejected")
            {
                users = users.Where(u => !u.IsActive);
            }
            else
            {
                throw new ArgumentException("Invalid status. Use approved or rejected");
            }

            var result = new List<AdvisorStatusDto>();

            foreach (var user in await users.ToListAsync())
            {
                var roles = await _userManager.GetRolesAsync(user);
                if (!roles.Contains("Advisor"))
                    continue;

                var advisor = await _advisorRepo.GetByUserIdAsync(user.Id);
                if (advisor == null)
                    continue;

                result.Add(new AdvisorStatusDto
                {
                    UserId = user.Id,
                    AdvisorId = advisor.AdvisorId,
                    FullName = advisor.FullName,
                    Email = user.Email!,
                    ActionDate = user.ApprovedAt,
                    Status = status
                });
            }

            return result;
        }
    }
}
