using System.Text.Json.Serialization;

namespace VaraPrints.Application.Models
{
    public class ResponseModel
    {
        public int StatusCode { get; set; }
        public string StatusMessage { get; set; }
            [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public object? Data { get; set; }

        public ResponseModel () { }

        public ResponseModel(int statusCode, string message)
        {
            StatusCode = statusCode;
            StatusMessage = message;
        }

        public ResponseModel(int statusCode, string message, object? data)
        {
            StatusCode = statusCode;
            StatusMessage = message;
            Data = data;
        }
    }
}
