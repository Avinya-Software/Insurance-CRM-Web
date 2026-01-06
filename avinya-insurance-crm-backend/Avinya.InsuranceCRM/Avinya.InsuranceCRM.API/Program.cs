using Avinya.InsuranceCRM.API.Middleware;
using Avinya.InsuranceCRM.API.Seeders;
using Avinya.InsuranceCRM.Infrastructure.Persistence;
using Avinya.InsuranceCRM.Infrastructure.RepositoryImplementation;
using Avinya.InsuranceCRM.Infrastructure.RepositoryInterface;
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

#region IDENTITY
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();
#endregion

#region 🔥 PREVENT IDENTITY REDIRECTS (CRITICAL)
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

#region CORS (JWT BASED – NO COOKIES)
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
        // ❌ NO AllowCredentials (JWT uses headers)
    });
});
#endregion

#region JWT AUTH
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
});
#endregion

#region MVC + VALIDATION
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
#endregion

#region DI
builder.Services.AddScoped<IAdvisorRepository, AdvisorRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IInsurerRepository, InsurerRepository>();
builder.Services.AddScoped<ILeadRepository, LeadRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICustomerPolicyRepository, CustomerPolicyRepository>();
builder.Services.AddScoped<ILeadFollowUpRepository, LeadFollowUpRepository>();
builder.Services.AddScoped<IClaimRepository, ClaimRepository>();
builder.Services.AddScoped<IRenewalRepository, RenewalRepository>();
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

#region 🔥 SERVER / IIS FIXES (VERY IMPORTANT)

// Handle reverse proxy / IIS HTTPS redirects
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto
});

app.UseRouting();
app.UseCors("FrontendPolicy");

#endregion

#region MIDDLEWARE

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
