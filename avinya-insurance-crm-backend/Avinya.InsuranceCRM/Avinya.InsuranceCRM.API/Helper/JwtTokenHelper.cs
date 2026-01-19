using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Avinya.InsuranceCRM.API.Helpers
{
    public static class JwtTokenHelper
    {
        // =========================
        // ADVISOR TOKEN (OPTIONAL)
        // =========================
        public static (string token, DateTime expiresAt) GenerateToken(
            ApplicationUser user,
            Advisor advisor,
            IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("Jwt");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim("FullName", advisor.FullName),
                new Claim(ClaimTypes.Role, "Advisor"),
                new Claim("CompanyId", user.CompanyId?.ToString() ?? ""),
                new Claim("IsApproved", user.IsApproved.ToString())
            };

            return GenerateJwt(claims, jwtSettings);
        }

        // =========================
        // SUPER ADMIN TOKEN
        // =========================
        public static (string token, DateTime expiresAt) GenerateAdminToken(
            ApplicationUser user,
            IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("Jwt");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(ClaimTypes.Role, "SuperAdmin")
            };

            return GenerateJwt(claims, jwtSettings);
        }

        // =========================
        // COMPANY ADMIN TOKEN
        // =========================
        public static (string token, DateTime expiresAt) GenerateCompanyAdminToken(
            ApplicationUser user,
            IConfiguration configuration)
        {
            if (user.CompanyId == null)
                throw new ArgumentException("CompanyAdmin must have CompanyId");

            var jwtSettings = configuration.GetSection("Jwt");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(ClaimTypes.Role, "CompanyAdmin"),
                new Claim("CompanyId", user.CompanyId.ToString()!)
            };

            return GenerateJwt(claims, jwtSettings);
        }

        // =========================
        // BASE TOKEN (LOGIN TOKEN)
        // =========================
        // 🔥 THIS IS THE IMPORTANT ONE
        public static async Task<(string token, DateTime expiresAt)> GenerateBaseToken(
            ApplicationUser user,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("Jwt");

            var roles = await userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim("CompanyId", user.CompanyId?.ToString() ?? ""),
                new Claim("IsApproved", user.IsApproved.ToString())
            };

            // ✅ ADD ROLE CLAIMS (FIX FOR 403)
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return GenerateJwt(claims, jwtSettings);
        }

        // =========================
        // COMMON JWT BUILDER
        // =========================
        private static (string token, DateTime expiresAt) GenerateJwt(
            List<Claim> claims,
            IConfigurationSection jwtSettings)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"]!)
            );

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var expires = DateTime.UtcNow.AddMinutes(
                Convert.ToDouble(jwtSettings["DurationInMinutes"])
            );

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return (
                new JwtSecurityTokenHandler().WriteToken(token),
                expires
            );
        }
    }
}
