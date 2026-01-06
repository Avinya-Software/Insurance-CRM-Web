using Avinya.InsuranceCRM.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Avinya.InsuranceCRM.API.Helpers
{
    public static class JwtTokenHelper
    {
        public static (string token, DateTime expiresAt) GenerateToken(
            IdentityUser user,
            Advisor advisor,
            IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("Jwt");

            var claims = new List<Claim>
            {
                // 🔑 THIS IS THE ONLY AdvisorId YOU SHOULD USE
                new Claim(ClaimTypes.NameIdentifier, user.Id),

                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim("FullName", advisor.FullName),

                // Role for authorization
                new Claim(ClaimTypes.Role, "Advisor")
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
