using Avinya.InsuranceCRM.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Avinya.InsuranceCRM.API.Seeders;

public static class SuperAdminSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var userManager = scope.ServiceProvider
            .GetRequiredService<UserManager<ApplicationUser>>();

        var roleManager = scope.ServiceProvider
            .GetRequiredService<RoleManager<IdentityRole>>();

        const string superAdminRole = "SuperAdmin";
        const string email = "admin@avinyasoftware.com";
        const string password = "Admin@123"; // 🔴 Change after first login

        // 1️⃣ Ensure role exists
        if (!await roleManager.RoleExistsAsync(superAdminRole))
        {
            await roleManager.CreateAsync(new IdentityRole(superAdminRole));
        }

        // 2️⃣ Check if admin exists
        var user = await userManager.FindByEmailAsync(email);

        if (user != null)
            return; // ✅ Already seeded

        // 3️⃣ Create admin user
        user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true,
            IsApproved = true,
            IsActive = true
        };

        var result = await userManager.CreateAsync(user, password);

        if (!result.Succeeded)
        {
            throw new Exception(
                $"SuperAdmin creation failed: {string.Join(", ", result.Errors.Select(e => e.Description))}"
            );
        }

        // 4️⃣ Assign role
        await userManager.AddToRoleAsync(user, superAdminRole);
    }
}
