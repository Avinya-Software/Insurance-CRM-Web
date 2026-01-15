using Avinya.InsuranceCRM.Domain.Entities;
using Avinya.InsuranceCRM.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // ---------------- DB SETS ----------------
    public DbSet<Customer> Customers { get; set; } = null!;
    public DbSet<Insurer> Insurers { get; set; } = null!;
    public DbSet<Advisor> Advisors => Set<Advisor>();
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<LeadStatus> LeadStatuses => Set<LeadStatus>();
    public DbSet<LeadSource> LeadSources => Set<LeadSource>();
    public DbSet<ProductCategory> ProductCategories => Set<ProductCategory>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<PolicyStatusMaster> PolicyStatuses => Set<PolicyStatusMaster>();
    public DbSet<PolicyTypeMaster> PolicyTypes => Set<PolicyTypeMaster>();
    public DbSet<CustomerPolicy> CustomerPolicies => Set<CustomerPolicy>();
    public DbSet<LeadFollowUp> LeadFollowUps => Set<LeadFollowUp>();
    public DbSet<InsuranceClaim> Claims => Set<InsuranceClaim>();
    public DbSet<ClaimTypeMaster> ClaimTypes => Set<ClaimTypeMaster>();
    public DbSet<ClaimStageMaster> ClaimStages => Set<ClaimStageMaster>();
    public DbSet<ClaimHandlerMaster> ClaimHandlers => Set<ClaimHandlerMaster>();
    public DbSet<RenewalStatusMaster> RenewalStatuses => Set<RenewalStatusMaster>();
    public DbSet<Renewal> Renewals => Set<Renewal>();
    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<CampaignRule> CampaignRules => Set<CampaignRule>();
    public DbSet<CampaignTemplate> CampaignTemplates => Set<CampaignTemplate>();
    public DbSet<CampaignLog> CampaignLogs => Set<CampaignLog>();
    public DbSet<CampaignCustomer> CampaignCustomers => Set<CampaignCustomer>();
    public DbSet<MasterCampaignType> MasterCampaignTypes => Set<MasterCampaignType>();
    public DbSet<SystemEvent> SystemEvents => Set<SystemEvent>();

    // ---------------- MODEL CONFIG ----------------
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // ---------------- CUSTOMER CONFIG ----------------
        builder.Entity<Customer>(entity =>
        {
           
            // FK to AspNetUsers (Advisor)
            entity.HasOne<ApplicationUser>()
                  .WithMany()
                  .HasForeignKey(x => x.AdvisorId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ---------------- LEAD → LEAD STATUS ----------------
        builder.Entity<Lead>(entity =>
        {
            entity.HasOne(l => l.LeadStatus)
                  .WithMany()
                  .HasForeignKey(l => l.LeadStatusId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(l => l.LeadSource)
                  .WithMany()
                  .HasForeignKey(l => l.LeadSourceId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.Property(l => l.LeadSourceDescription)
                  .HasMaxLength(200);
        });

        // ---------------- PRODUCT CATEGORY ----------------
        builder.Entity<ProductCategory>(entity =>
        {
            entity.HasKey(x => x.ProductCategoryId);

            entity.Property(x => x.CategoryName)
                  .HasMaxLength(50)
                  .IsRequired();

            entity.HasIndex(x => x.CategoryName)
                  .IsUnique();
        });

        // ---------------- PRODUCT ----------------
        builder.Entity<Product>(entity =>
        {
            entity.HasKey(x => x.ProductId);

            entity.Property(x => x.ProductName)
                  .HasMaxLength(150)
                  .IsRequired();

            entity.Property(x => x.ProductCode)
                  .HasMaxLength(50)
                  .IsRequired();

            entity.HasIndex(x => x.ProductCode)
                  .IsUnique();
        });
        // ---------------- CUSTOMER POLICY ----------------
        builder.Entity<CustomerPolicy>(entity =>
        {
            entity.HasOne(x => x.PolicyStatus)
                  .WithMany()
                  .HasForeignKey(x => x.PolicyStatusId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.PolicyType)
                  .WithMany()
                  .HasForeignKey(x => x.PolicyTypeId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
        // ---------------- LEAD → FOLLOW UPS ----------------
        builder.Entity<LeadFollowUp>(entity =>
        {
            entity.HasKey(x => x.FollowUpId);

            entity.Property(x => x.Remark)
                  .HasMaxLength(500);

            entity.HasOne(x => x.Lead)
                  .WithMany(l => l.FollowUps)
                  .HasForeignKey(x => x.LeadId)
                  .OnDelete(DeleteBehavior.Cascade); // ✅ FK enforced
        });
        // ---------------- INSURANCE CLAIM ----------------
        builder.Entity<InsuranceClaim>(entity =>
        {
            entity.HasKey(x => x.ClaimId);

            entity.HasOne(x => x.Customer)
                  .WithMany()
                  .HasForeignKey(x => x.CustomerId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Policy)
                  .WithMany()
                  .HasForeignKey(x => x.PolicyId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.ClaimType)
                  .WithMany()
                  .HasForeignKey(x => x.ClaimTypeId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.ClaimStage)
                  .WithMany()
                  .HasForeignKey(x => x.ClaimStageId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.ClaimHandler)
                  .WithMany()
                  .HasForeignKey(x => x.ClaimHandlerId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.Property(x => x.ClaimAmount)
                  .HasColumnType("decimal(18,2)");

            entity.Property(x => x.ApprovedAmount)
                  .HasColumnType("decimal(18,2)");

            entity.Property(x => x.Documents)
                  .HasMaxLength(2000);

            entity.Property(x => x.Status)
                  .HasMaxLength(50);
        });
        builder.Entity<ClaimHandlerMaster>(entity =>
        {
            entity.HasKey(x => x.ClaimHandlerId);

            entity.Property(x => x.HandlerName)
                  .HasMaxLength(100)
                  .IsRequired();
        });
        builder.Entity<ClaimTypeMaster>(entity =>
        {
            entity.HasKey(x => x.ClaimTypeId);

            entity.Property(x => x.TypeName)
                  .HasMaxLength(100)
                  .IsRequired();
        });

        builder.Entity<ClaimStageMaster>(entity =>
        {
            entity.HasKey(x => x.ClaimStageId);

            entity.Property(x => x.StageName)
                  .HasMaxLength(100)
                  .IsRequired();
        });
        // ---------------- RENEWAL STATUS MASTER ----------------
        builder.Entity<RenewalStatusMaster>(entity =>
        {
            entity.HasKey(x => x.RenewalStatusId);

            entity.Property(x => x.StatusName)
                  .HasMaxLength(50)
                  .IsRequired();

            entity.HasIndex(x => x.StatusName)
                  .IsUnique();
        });
        // ---------------- RENEWAL ----------------
        builder.Entity<Renewal>(entity =>
        {
            entity.HasKey(x => x.RenewalId);

            // ---------- FKs ----------
            entity.HasOne(x => x.Policy)
                  .WithMany()
                  .HasForeignKey(x => x.PolicyId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Customer)
                  .WithMany()
                  .HasForeignKey(x => x.CustomerId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.RenewalStatus)
                  .WithMany()
                  .HasForeignKey(x => x.RenewalStatusId)
                  .OnDelete(DeleteBehavior.Restrict);

            // ---------- JSON / LOGS ----------
            entity.Property(x => x.ReminderDatesJson)
                  .HasColumnType("nvarchar(max)")
                  .IsRequired();

            entity.Property(x => x.ReminderLog)
                  .HasColumnType("nvarchar(max)");

            // ---------- FINANCIAL ----------
            entity.Property(x => x.RenewalPremium)
                  .HasColumnType("decimal(18,2)");

            // ---------- AUDIT ----------
            entity.Property(x => x.CreatedBy)
                  .HasMaxLength(450)
                  .IsRequired();

            entity.Property(x => x.CreatedAt)
                  .IsRequired();

            // ---------- INDEXES ----------
            entity.HasIndex(x => x.PolicyId);
            entity.HasIndex(x => x.CustomerId);
            entity.HasIndex(x => x.RenewalStatusId);
            entity.HasIndex(x => x.RenewalDate);
        });


        builder.Entity<Campaign>(entity =>
        {
            entity.HasKey(x => x.CampaignId);

            entity.Property(x => x.Name)
                  .HasMaxLength(150)
                  .IsRequired();

            entity.Property(x => x.CampaignType)
                  .HasMaxLength(50)
                  .IsRequired();

            entity.Property(x => x.Channel)
                  .HasMaxLength(20)
                  .IsRequired();

            entity.Property(x => x.AdvisorId)
                  .HasMaxLength(450)
                  .IsRequired();

            entity.Property(x => x.CreatedAt)
                  .IsRequired();
        });

        builder.Entity<CampaignRule>(entity =>
        {
            entity.HasKey(x => x.CampaignRuleId);

            entity.Property(x => x.RuleEntity)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(x => x.RuleField)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(x => x.Operator)
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(x => x.RuleValue)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(x => x.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            entity.Property(x => x.SortOrder)
                .IsRequired()
                .HasDefaultValue(0);

            entity.Property(x => x.CreatedAt)
                .IsRequired();

            entity.HasOne(x => x.Campaign)
                .WithMany(c => c.Rules)
                .HasForeignKey(x => x.CampaignId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(x => new { x.CampaignId, x.IsActive });
        });


        builder.Entity<CampaignTemplate>(entity =>
        {
            entity.HasKey(x => x.TemplateId);

            entity.Property(x => x.Subject)
                  .HasMaxLength(200);

            entity.Property(x => x.Channel)
                  .HasMaxLength(20)
                  .IsRequired();
        });

        builder.Entity<CampaignLog>(entity =>
        {
            entity.HasKey(x => x.CampaignLogId);

            entity.HasIndex(x => new { x.CampaignId, x.CustomerId, x.TriggerDate })
                  .IsUnique();
        });
        builder.Entity<CampaignCustomer>(entity =>
{
            entity.HasKey(x => x.CampaignCustomerId);

            entity.HasIndex(x => new { x.CampaignId, x.CustomerId })
                  .IsUnique(); // prevents duplicates

            entity.HasOne(x => x.Campaign)
                  .WithMany(c => c.CampaignCustomers)
                  .HasForeignKey(x => x.CampaignId);

            entity.HasOne(x => x.Customer)
                  .WithMany(c => c.CampaignCustomers)
                  .HasForeignKey(x => x.CustomerId);
        });
        builder.Entity<MasterCampaignType>(entity =>
        {
            entity.ToTable("MasterCampaignTypes");

            entity.HasKey(x => x.CampaignTypeId);

            entity.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(x => x.IsActive)
                .HasDefaultValue(true);

            entity.Property(x => x.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
        });
        builder.Entity<SystemEvent>()
        .HasIndex(e => new
        {
            e.EventType,
            e.EventDate,
            e.LeadId,
            e.PolicyId
        })
        .IsUnique();



        // ---------------- LEAD STATUS MASTER DATA ----------------
        builder.Entity<LeadStatus>().HasData(
            new LeadStatus { LeadStatusId = 1, StatusName = "New", IsActive = true, CreatedAt = DateTime.UtcNow },
            new LeadStatus { LeadStatusId = 2, StatusName = "Contacted", IsActive = true, CreatedAt = DateTime.UtcNow },
            new LeadStatus { LeadStatusId = 3, StatusName = "Qualified", IsActive = true, CreatedAt = DateTime.UtcNow },
            new LeadStatus { LeadStatusId = 4, StatusName = "Follow Up", IsActive = true, CreatedAt = DateTime.UtcNow },
            new LeadStatus { LeadStatusId = 5, StatusName = "Converted", IsActive = true, CreatedAt = DateTime.UtcNow },
            new LeadStatus { LeadStatusId = 6, StatusName = "Lost", IsActive = true, CreatedAt = DateTime.UtcNow }
        );

        // ---------------- LEAD SOURCE MASTER DATA ----------------
        builder.Entity<LeadSource>().HasData(
            new LeadSource { LeadSourceId = 1, SourceName = "Website" },
            new LeadSource { LeadSourceId = 2, SourceName = "Referral" },
            new LeadSource { LeadSourceId = 3, SourceName = "Agent" },
            new LeadSource { LeadSourceId = 4, SourceName = "Campaign" },
            new LeadSource { LeadSourceId = 5, SourceName = "Other" }
        );

        // ---------------- PRODUCT CATEGORY MASTER DATA ----------------
        builder.Entity<ProductCategory>().HasData(
            new ProductCategory { ProductCategoryId = 1, CategoryName = "Term", IsActive = true, CreatedAt = DateTime.UtcNow },
            new ProductCategory { ProductCategoryId = 2, CategoryName = "Health", IsActive = true, CreatedAt = DateTime.UtcNow },
            new ProductCategory { ProductCategoryId = 3, CategoryName = "Motor", IsActive = true, CreatedAt = DateTime.UtcNow },
            new ProductCategory { ProductCategoryId = 4, CategoryName = "Fire", IsActive = true, CreatedAt = DateTime.UtcNow }
        );
        // ---------------- POLICY STATUS MASTER ----------------
        builder.Entity<PolicyStatusMaster>().HasData(
            new PolicyStatusMaster { PolicyStatusId = 1, StatusName = "Active", IsActive = true },
            new PolicyStatusMaster { PolicyStatusId = 2, StatusName = "Lapsed", IsActive = true },
            new PolicyStatusMaster { PolicyStatusId = 3, StatusName = "Cancelled", IsActive = true },
            new PolicyStatusMaster { PolicyStatusId = 4, StatusName = "Pending", IsActive = true }
        );

        // ---------------- POLICY TYPE MASTER ----------------
        builder.Entity<PolicyTypeMaster>().HasData(
            new PolicyTypeMaster { PolicyTypeId = 1, TypeName = "Fresh", IsActive = true },
            new PolicyTypeMaster { PolicyTypeId = 2, TypeName = "Renewal", IsActive = true },
            new PolicyTypeMaster { PolicyTypeId = 3, TypeName = "Lost", IsActive = true }

        );
        // ---------------- CLAIM TYPE MASTER ----------------
        builder.Entity<ClaimTypeMaster>().HasData(
            new ClaimTypeMaster { ClaimTypeId = 1, TypeName = "Accident", IsActive = true },
            new ClaimTypeMaster { ClaimTypeId = 2, TypeName = "Medical", IsActive = true },
            new ClaimTypeMaster { ClaimTypeId = 3, TypeName = "Death", IsActive = true },
            new ClaimTypeMaster { ClaimTypeId = 4, TypeName = "Theft", IsActive = true },
            new ClaimTypeMaster { ClaimTypeId = 5, TypeName = "Fire", IsActive = true },
            new ClaimTypeMaster { ClaimTypeId = 6, TypeName = "NaturalDisaster", IsActive = true }
        );

        // ---------------- CLAIM STAGE MASTER ----------------
        builder.Entity<ClaimStageMaster>().HasData(
            new ClaimStageMaster { ClaimStageId = 1, StageName = "Initiated", IsActive = true },
            new ClaimStageMaster { ClaimStageId = 2, StageName = "DocumentsPending", IsActive = true },
            new ClaimStageMaster { ClaimStageId = 3, StageName = "UnderReview", IsActive = true },
            new ClaimStageMaster { ClaimStageId = 4, StageName = "Approved", IsActive = true },
            new ClaimStageMaster { ClaimStageId = 5, StageName = "Rejected", IsActive = true },
            new ClaimStageMaster { ClaimStageId = 6, StageName = "Settled", IsActive = true }
        );

        // ---------------- CLAIM HANDLER MASTER ----------------
        builder.Entity<ClaimHandlerMaster>().HasData(
            new ClaimHandlerMaster { ClaimHandlerId = 1, HandlerName = "Advisor", IsActive = true },
            new ClaimHandlerMaster { ClaimHandlerId = 2, HandlerName = "ClaimOfficer", IsActive = true },
            new ClaimHandlerMaster { ClaimHandlerId = 3, HandlerName = "Surveyor", IsActive = true },
            new ClaimHandlerMaster { ClaimHandlerId = 4, HandlerName = "Manager", IsActive = true }
        );
        builder.Entity<RenewalStatusMaster>().HasData(
        new RenewalStatusMaster { RenewalStatusId = 1, StatusName = "Pending", IsActive = true },
        new RenewalStatusMaster { RenewalStatusId = 2, StatusName = "Renewed", IsActive = true },
        new RenewalStatusMaster { RenewalStatusId = 3, StatusName = "Lost", IsActive = true }
        );
        builder.Entity<MasterCampaignType>().HasData(
        new MasterCampaignType{CampaignTypeId = 1, Name = "Promotional",IsActive = true, CreatedAt = DateTime.UtcNow},
        new MasterCampaignType{CampaignTypeId = 2, Name = "Birthday",IsActive = true,CreatedAt = DateTime.UtcNow },
        new MasterCampaignType{CampaignTypeId = 3,Name = "Policy Renewal",IsActive = true, CreatedAt = DateTime.UtcNow},
        new MasterCampaignType{CampaignTypeId = 4,Name = "Payment Reminder",  IsActive = true,CreatedAt = DateTime.UtcNow},
        new MasterCampaignType{CampaignTypeId = 5, Name = "Policy Expiry", IsActive = true, CreatedAt = DateTime.UtcNow },
        new MasterCampaignType{CampaignTypeId = 6,Name = "Custom",IsActive = true,CreatedAt = DateTime.UtcNow }
        );
    }
}
