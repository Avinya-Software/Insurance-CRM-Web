namespace Avinya.InsuranceCRM.API.Models
{
    public class ApiResponse<T>
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public ApiResponse(int statusCode, string message, T? data = default)
        {
            StatusCode = statusCode;
            Message = message; 
            Data = data;
        }
        public static ApiResponse<T> Success(T data, string message = "Success")
            => new(200, message, data);

        public static ApiResponse<T> Fail(int statusCode, string message)
            => new(statusCode, message, default);
    }
}
