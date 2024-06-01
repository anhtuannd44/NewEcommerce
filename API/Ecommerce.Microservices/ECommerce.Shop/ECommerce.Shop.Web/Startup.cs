using System.Text;
using ECommerce.Common.Domain.Identity;
using ECommerce.Common.Infrastructure;
using ECommerce.Common.Infrastructure.HealthChecks;
using ECommerce.Common.Infrastructure.Identity;
using ECommerce.Common.Infrastructure.Web.Middleware;
using ECommerce.Common.Middleware.ClaimsTransformations;
using ECommerce.Common.Middleware.Extensions;
using ECommerce.Common.Middleware.Filter;
using ECommerce.Common.Middleware.SwaggerConfiguration;
using ECommerce.Common.Persistence;
using ECommerce.Shop.Application;
using ECommerce.Shop.Application.ConfigurationOptions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace ECommerce.Shop.Web;

public class Startup
{
    private IConfiguration Configuration { get; }
    private AppSettingConfiguration AppSettings { get; }

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
        AppSettings = new AppSettingConfiguration();
        Configuration.Bind(AppSettings);
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = AppSettings.Auth.Jwt.Issuer,
                    ValidAudience = AppSettings.Auth.Jwt.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppSettings.Auth.Jwt.SymmetricKey))
                };
            });

        services.AddPersistence(AppSettings.SqlServerConnection.GetAndBuildSqlConnection())
            .AddApplicationShopServices()
            .AddInfrastructure();

        services.AddECommerceIdentity(AppSettings.Auth);
        services.AddScoped<IClaimsTransformation, CustomClaimsTransformation>();
        services.AddMemoryCache();
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUser, CurrentWebUser>();
        services.Configure<ApiBehaviorOptions>(options => { options.SuppressModelStateInvalidFilter = true; });
        services.AddCors();
        services.AddControllers(configure => { configure.Filters.Add(typeof(GlobalExceptionFilter)); })
            .AddJsonOptions(_ => { });
        services.AddHttpClient();

        services.AddSwaggerGen(c =>
        {
            c.TagActionsBy(x =>
            {
                var actionDescriptor = (ControllerActionDescriptor)x.ActionDescriptor;
                var tagNameAttribute = (SwaggerTagNameAttribute)actionDescriptor.ControllerTypeInfo
                    .GetCustomAttributes(typeof(SwaggerTagNameAttribute), false).FirstOrDefault();

                if (tagNameAttribute != null)
                {
                    return new[] { tagNameAttribute.DisplayName };
                }

                return new[] { actionDescriptor.ControllerName };
            });

            c.CustomSchemaIds(new CustomSchemaStrategy().SwaggerSchemaId);
            c.SchemaFilter<EnumSchemaFilter>();

            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "ECommerce API - V1",
                Version = "v1"
            });

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
            {
                
                In = ParameterLocation.Header,
                Description = "Please insert JWT token with the prefix Bearer into field",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer",
                        },
                    },
                    new string[] { }
                },
            });
        });

        services.AddHealthChecks()
            .AddSqlServerCheck(connectionString: AppSettings.SqlServerConnection.GetAndBuildSqlConnection(),
                healthQuery: "SELECT 1;",
                name: "ECommerce Sql Server",
                failureStatus: HealthStatus.Degraded);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseLoggingStatusCodeMiddleware();

        app.UseHealthChecks("/healthz", new HealthCheckOptions
        {
            Predicate = _ => true,
            ResponseWriter = (context, healthReport) => HealthChecksResponseWriter.WriteResponse(context, healthReport, AppSettings.HealthChecks.AccessKey),
            ResultStatusCodes =
            {
                [HealthStatus.Healthy] = StatusCodes.Status200OK,
                [HealthStatus.Degraded] = StatusCodes.Status500InternalServerError,
                [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable,
            },
        });

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        app.Use(async (context, next) =>
        {
            context.Request.EnableBuffering();
            await next();
        });
        app.UseCors(x => x.AllowAnyOrigin()
            .WithMethods("POST", "GET", "PUT", "DELETE", "OPTIONS")
            .AllowAnyHeader()
            .WithExposedHeaders("X-Filename", "Session-Expired")
        );
        app.UseRouting();
        app.UseAuthentication();

        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "ECommerce API v1");
        });

        app.UseAuthorization();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
        
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(
                Path.Combine(env.ContentRootPath, "Uploads")),
            RequestPath = "/Uploads"
        });
    }
}