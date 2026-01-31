using Avinya.InsuranceCRM.Application.DTOs.Admin;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Helpers;
using Avinya.InsuranceCRM.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
    public class AdminRepository : IAdminRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAdvisorRepository _advisorRepo;
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AdminRepository(
            UserManager<ApplicationUser> userManager,
            IAdvisorRepository advisorRepo,
            AppDbContext db,
            IConfiguration config)
        {
            _userManager = userManager;
            _advisorRepo = advisorRepo;
            _db = db;
            _config = config;
        }

        public async Task<(bool IsSuccess, AdminLoginResponseDto? Data, string Message, int StatusCode)> LoginAsync(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return (false, null, "Invalid credentials", 401);

            if (!await _userManager.IsInRoleAsync(user, "SuperAdmin"))
                return (false, null, "Not an admin account", 403);

            if (!user.IsActive)
                return (false, null, "Admin account is disabled", 403);

            if (!await _userManager.CheckPasswordAsync(user, password))
                return (false, null, "Invalid credentials", 401);

            var (token, expiresAt) = JwtTokenHelper.GenerateAdminToken(user, _config);

            return (true, new AdminLoginResponseDto
            {
                Email = user.Email!,
                Token = token,
                ExpiresAt = expiresAt
            }, "Admin login successful", 200);
        }

        public async Task<List<PendingAdvisorDto>> GetPendingAdvisorsAsync()
        {
            var users = await _userManager.Users
                .Where(x => !x.IsApproved && x.IsActive)
                .ToListAsync();

            var list = new List<PendingAdvisorDto>();

            foreach (var user in users)
            {
                if (!await _userManager.IsInRoleAsync(user, "Advisor"))
                    continue;


                var advisor = await _advisorRepo.GetByUserIdAsync(user.Id);
                if (advisor == null) continue;

                list.Add(new PendingAdvisorDto
                {
                    UserId = user.Id,
                    AdvisorId = advisor.AdvisorId,
                    FullName = advisor.FullName,
                    Email = user.Email!
                });
            }
            return list;
        }

        public async Task<List<PendingCompanyDto>> GetPendingCompaniesAsync()
        {
            var users = await _userManager.Users
                .Where(x => x.CompanyId != null && !x.IsApproved && x.IsActive)
                .ToListAsync();

            var list = new List<PendingCompanyDto>();

            foreach (var user in users)
            {
                if (!await _userManager.IsInRoleAsync(user, "CompanyAdmin"))
                    continue;

                var company = await _db.Companies.FindAsync(user.CompanyId);
                if (company == null) continue;

                list.Add(new PendingCompanyDto
                {
                    CompanyId = company.CompanyId,
                    CompanyName = company.CompanyName,
                    AdminUserId = user.Id,
                    AdminEmail = user.Email!,
                    CreatedAt = company.CreatedAt
                });
            }
            return list;
        }

        public async Task<bool> ApproveAsync(string userId, string adminId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            user.IsApproved = true;
            user.ApprovedAt = DateTime.UtcNow;
            user.ApprovedBy = adminId;

            await _userManager.UpdateAsync(user);
            return true;
        }

        public async Task<bool> DeleteAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            user.IsActive = false;
            await _userManager.UpdateAsync(user);
            return true;
        }

        public async Task<List<AdvisorStatusDto>> GetAdvisorsByStatusAsync(string status, DateTime? from, DateTime? to)
        {
            var users = _userManager.Users.AsQueryable();

            if (status == "approved")
            {
                users = users.Where(x => x.IsApproved && x.IsActive);
                if (from.HasValue) users = users.Where(x => x.ApprovedAt >= from);
                if (to.HasValue) users = users.Where(x => x.ApprovedAt <= to);
            }
            else
            {
                users = users.Where(x => !x.IsActive);
            }

            var result = new List<AdvisorStatusDto>();

            foreach (var user in await users.ToListAsync())
            {
                if (!await _userManager.IsInRoleAsync(user, "Advisor"))
                    continue;

                var advisor = await _advisorRepo.GetByUserIdAsync(user.Id);
                if (advisor == null) continue;

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
