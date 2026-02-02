using System.Security.Claims;
using Avinya.InsuranceCRM.Application.DTOs.Auth;
using Avinya.InsuranceCRM.Application.RepositoryInterface;
using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Helpers;
using Avinya.InsuranceCRM.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation
{
        public class AuthRepository : IAuthRepository
        {
            private readonly AppDbContext _context;
            private readonly UserManager<ApplicationUser> _userManager;
            private readonly IConfiguration _configuration;

            public AuthRepository(
                AppDbContext context,
                UserManager<ApplicationUser> userManager,
                IConfiguration configuration)
            {
                _context = context;
                _userManager = userManager;
                _configuration = configuration;
            }

        public async Task<(bool IsSuccess, string Message)> RegisterAdvisorAsync(RegisterAdvisorRequestDto request, ClaimsPrincipal userClaims)
        {
            try
            {
                var companyClaim = userClaims.FindFirst("CompanyId")?.Value;
                if (string.IsNullOrEmpty(companyClaim))
                    return (false, "Company context missing in token");

                var companyId = Guid.Parse(companyClaim);

                var existingUser = await _userManager.FindByEmailAsync(request.Email);
                if (existingUser != null)
                    return (false, "Email already registered");

                var user = new ApplicationUser
                {
                    UserName = request.FullName,
                    Email = request.Email,
                    CompanyId = companyId,
                    IsApproved = true,
                    IsActive = true
                };

                var result = await _userManager.CreateAsync(user, request.Password);
                if (!result.Succeeded)
                    return (false, string.Join(", ", result.Errors.Select(e => e.Description)));

                await _userManager.AddToRoleAsync(user, "Advisor");

                var advisor = new Advisor
                {
                    AdvisorId = Guid.NewGuid(),
                    UserId = user.Id,
                    CompanyId = companyId,
                    FullName = request.FullName,
                    MobileNumber = request.MobileNumber,
                    Email = request.Email,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Advisors.Add(advisor);
                await _context.SaveChangesAsync();

                return (true, "Advisor registered successfully");
            }
            catch (Exception)
            {

                throw;
            }
            
        }

        public async Task<(bool IsSuccess, string Message)> RegisterCompanyAdminAsync(RegisterCompanyRequestDto request)
        {
            try
            {
                var existingUser = await _userManager.FindByEmailAsync(request.Email);
                if (existingUser != null)
                    return (false, "Email already registered");

                var company = new Company
                {
                    CompanyId = Guid.NewGuid(),
                    CompanyName = request.CompanyName,
                    MobileNumber = request.MobileNumber,
                    Email = request.Email,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Companies.Add(company);
                await _context.SaveChangesAsync();

                var user = new ApplicationUser
                {
                    UserName = request.Email,
                    Email = request.Email,
                    IsApproved = false,
                    IsActive = true,
                    CompanyId = company.CompanyId
                };

                var result = await _userManager.CreateAsync(user, request.Password);
                if (!result.Succeeded)
                    return (false, string.Join(", ", result.Errors.Select(e => e.Description)));

                await _userManager.AddToRoleAsync(user, "CompanyAdmin");

                return (true, "Company registered successfully");
            }
            catch (Exception)
            {

                throw;
            }
            
        }

        public async Task<(bool IsSuccess, string Message, AuthResponseDto? Data)> LoginAsync(LoginRequestDto request)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);
                if (user == null || !user.IsActive)
                    return (false, "Invalid credentials", null);

                if (!await _userManager.CheckPasswordAsync(user, request.Password))
                    return (false, "Invalid credentials", null);

                var role = (await _userManager.GetRolesAsync(user)).First();

                if (role == "CompanyAdmin" && !user.IsApproved)
                    return (false, "Pending SuperAdmin approval", null);

                AdvisorProfileDto? advisorDto = null;

                if (role == "Advisor")
                {
                    var advisor = await _context.Advisors
                        .AsNoTracking()
                        .FirstOrDefaultAsync(x => x.UserId == user.Id && x.IsActive);

                    advisorDto = new AdvisorProfileDto
                    {
                        AdvisorId = advisor!.AdvisorId,
                        FullName = advisor.FullName,
                        MobileNumber = advisor.MobileNumber
                    };
                }

                var (token, expiresAt) =
                    await JwtTokenHelper.GenerateBaseToken(user, _userManager, _configuration);

                return (true, "Login successful", new AuthResponseDto
                {
                    UserId = user.Id,
                    Email = user.Email!,
                    CompanyId = user.CompanyId,
                    Role = role,
                    IsApproved = user.IsApproved,
                    AdvisorProfile = advisorDto,
                    Token = token,
                    ExpiresAt = expiresAt
                });
            }
        }

    }
