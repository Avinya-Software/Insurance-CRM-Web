namespace Avinya.InsuranceCRM.API.Models
{
    public class ReminderLogItem
    {
        public int DaysBefore { get; set; }
        public DateTime SentOn { get; set; }
        public string Channel { get; set; } = "Email";
    }

}