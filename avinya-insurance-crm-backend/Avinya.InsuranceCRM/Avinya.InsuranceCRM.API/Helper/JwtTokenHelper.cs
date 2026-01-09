using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Avinya.InsuranceCRM.API.Helpers
{
    public static class JwtTokenHelper
    {
        // ======================================================
        // ADVISOR TOKEN
        // ======================================================
        public static (string token, DateTime expiresAt) GenerateToken(
            ApplicationUser user,
            Advisor advisor,
            IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("Jwt");

            var claims = new List<Claim>
            {
                // 🔑 Identity User Id
                new Claim(ClaimTypes.NameIdentifier, user.Id),

                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim("FullName", advisor.FullName),

                // Role + Approval
                new Claim(ClaimTypes.Role, "Advisor"),
                new Claim("IsApproved", user.IsApproved.ToString())
            };

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

        // ======================================================
        // ADMIN TOKEN
        // ======================================================
        public static (string token, DateTime expiresAt) GenerateAdminToken(
            ApplicationUser user,
            IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("Jwt");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),

                // Admin role
                new Claim(ClaimTypes.Role, "SuperAdmin")
            };

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
