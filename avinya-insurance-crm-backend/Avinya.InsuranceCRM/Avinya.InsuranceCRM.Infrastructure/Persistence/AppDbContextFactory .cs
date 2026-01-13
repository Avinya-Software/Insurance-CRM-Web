using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Avinya.InsuranceCRM.Infrastructure.Persistence
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            //optionsBuilder.UseSqlServer("Server=190.92.174.109;Database=InsuranceCrmUat;User Id=insuranceuat;Password= insuranceuat@5039;TrustServerCertificate=True;");
            optionsBuilder.UseSqlServer("Server=DESKTOP-73GFB8V\\DEVSQL;Database=AvinyaInsuranceCRMTesting;Trusted_Connection=True;TrustServerCertificate=True");
            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
