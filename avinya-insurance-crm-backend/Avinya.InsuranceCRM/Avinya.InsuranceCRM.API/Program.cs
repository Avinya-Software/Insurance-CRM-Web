using Avinya.InsuranceCRM.API.Middleware;
using Avinya.InsuranceCRM.API.Seeders;
using Avinya.InsuranceCRM.Infrastructure.Email;
using Avinya.InsuranceCRM.Infrastructure.Identity;
using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
using Avinya.InsuranceCRM.Infrastructure.Services.Interfaces;
using Avinya.InsuranceCRM.Infrastructure.Workers;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

#region LOGGING
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Host.UseSerilog((context, services, config) =>
{
    config
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext();
});
#endregion

#region DATABASE
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new Exception("Missing DB connection string")
    )
);
#endregion

#region IDENTITY (✅ ONLY ONCE – ApplicationUser)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.User.RequireUniqueEmail = true;

    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();
#endregion

#region 🔥 PREVENT IDENTITY REDIRECTS (API SAFE)
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});
#endregion

#region CORS (JWT – NO COOKIES)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(
                "https://uatinsurancecrm.avinyasoftware.com",
                "http://localhost:5173",
                "http://localhost:4173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
#endregion

#region JWT AUTHENTICATION
var jwt = builder.Configuration.GetSection("Jwt");

if (string.IsNullOrWhiteSpace(jwt["Key"]))
    throw new Exception("JWT configuration missing");

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwt["Key"]!)
            ),

            RoleClaimType = ClaimTypes.Role,
            NameClaimType = ClaimTypes.NameIdentifier,
            ClockSkew = TimeSpan.Zero
        };
    });
#endregion

#region AUTHORIZATION
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdvisorOnly", policy =>
        policy.RequireRole("Advisor"));

    options.AddPolicy("ApprovedAdvisor", policy =>
    {
        policy.RequireRole("Advisor");
        policy.RequireClaim("IsApproved", "True");
    });
});
#endregion

#region MVC + VALIDATION
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
#endregion

#region DEPENDENCY INJECTION
builder.Services.AddScoped<IAdvisorRepository, AdvisorRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IInsurerRepository, InsurerRepository>();
builder.Services.AddScoped<ILeadRepository, LeadRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICustomerPolicyRepository, CustomerPolicyRepository>();
builder.Services.AddScoped<ILeadFollowUpRepository, LeadFollowUpRepository>();
builder.Services.AddScoped<IClaimRepository, ClaimRepository>();
builder.Services.AddScoped<IRenewalRepository, RenewalRepository>();
builder.Services.AddScoped<IAdminService, AdminService>();

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.Configure<SmtpSettings>(
    builder.Configuration.GetSection("Smtp"));

builder.Services.AddHostedService<RenewalReminderWorker>();
builder.Services.AddHostedService<CampaignWorker>();

builder.Services.AddScoped<ICampaignEmailService, CampaignEmailService>();
builder.Services.AddScoped<ICampaignRepository, CampaignRepository>();
builder.Services.AddHostedService<PolicyPaymentWorker>();
builder.Services.AddHostedService<RenewalExpiryWorker>();


#endregion

#region SWAGGER
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Avinya Insurance CRM API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
#endregion

var app = builder.Build();

#region SEED ROLES
try
{
    using var scope = app.Services.CreateScope();
    await IdentityRoleSeeder.SeedRolesAsync(scope.ServiceProvider);
}
catch (Exception ex)
{
    Console.WriteLine($"Role seeding failed: {ex.Message}");
}
#endregion
#region SEED SUPER ADMIN
try
{
    using var scope = app.Services.CreateScope();
    await SuperAdminSeeder.SeedAsync(scope.ServiceProvider);
}
catch (Exception ex)
{
    Console.WriteLine($"Super admin seeding failed: {ex.Message}");
}
#endregion


#region SERVER / IIS FIXES
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto
});
#endregion

#region PIPELINE
app.UseRouting();
app.UseCors("FrontendPolicy");

app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Insurance CRM API v1");
    c.RoutePrefix = "swagger";
});

app.MapControllers();
app.MapGet("/", () => "Insurance CRM API running 🚀");
#endregion

app.Run();
