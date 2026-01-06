using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Avinya.InsuranceCRM.Domain.ValueObjects
{
    public class ReminderLogItem
    {
        public int DaysBefore { get; set; }
        public DateTime SentOn { get; set; }
        public string Channel { get; set; } = "Email";
    }
}
