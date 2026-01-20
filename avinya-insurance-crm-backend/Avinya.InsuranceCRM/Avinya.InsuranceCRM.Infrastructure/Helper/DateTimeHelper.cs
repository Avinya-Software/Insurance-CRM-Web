namespace Avinya.InsuranceCRM.Infrastructure.Helper
{
    public static class DateTimeHelper
    {
        private static readonly TimeZoneInfo IndiaTimeZone =
        TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");

        public static DateTime ConvertUtcToLocal(DateTime utcDate)
        {
            return TimeZoneInfo.ConvertTimeFromUtc(utcDate, IndiaTimeZone);
        }
    }
}
