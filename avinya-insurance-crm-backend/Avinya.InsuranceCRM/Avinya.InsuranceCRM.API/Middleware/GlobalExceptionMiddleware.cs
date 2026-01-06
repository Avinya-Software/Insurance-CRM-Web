using Avinya.InsuranceCRM.API.Models;
using System.Net;
using System.Reflection;
using System.Text.Json;

namespace Avinya.InsuranceCRM.API.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ReflectionTypeLoadException ex)
            {
                // 🔥 VERY IMPORTANT: log all loader exceptions
                foreach (var loaderException in ex.LoaderExceptions!)
                {
                    _logger.LogError(loaderException, "Loader exception occurred");
                }

                await HandleExceptionAsync(context, ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            int statusCode = exception switch
            {
                KeyNotFoundException => (int)HttpStatusCode.NotFound,
                UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
                ArgumentException => (int)HttpStatusCode.BadRequest,
                _ => (int)HttpStatusCode.InternalServerError
            };

            var response = ApiResponse<string>.Fail(
                statusCode,
                exception.Message
            );

            context.Response.StatusCode = statusCode;

            return context.Response.WriteAsync(
                JsonSerializer.Serialize(response)
            );
        }
    }
}
