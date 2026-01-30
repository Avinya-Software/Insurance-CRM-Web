namespace Avinya.InsuranceCRM.Application.DTOs.Renewal
{
    public class UpsertRenewalDto
    {
        public Guid? RenewalId { get; set; }
        public Guid PolicyId { get; set; }
        public Guid CustomerId { get; set; }
        public DateTime RenewalDate { get; set; }
        public decimal RenewalPremium { get; set; }
        public int RenewalStatusId { get; set; }
        public string? ReminderDatesJson { get; set; }
    }
}
