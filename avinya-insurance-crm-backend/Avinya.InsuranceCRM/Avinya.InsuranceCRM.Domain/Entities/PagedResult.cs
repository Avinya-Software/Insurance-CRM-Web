namespace Avinya.InsuranceCRM.API.ResponseModels
{
    public class PagedRecordResult<T>
    {
        public int TotalRecords { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public IEnumerable<T> Data { get; set; } = new List<T>();
    }
}
