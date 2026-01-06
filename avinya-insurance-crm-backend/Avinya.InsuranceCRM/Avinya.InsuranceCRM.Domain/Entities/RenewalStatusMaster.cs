namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class RenewalStatusMaster
    {
        public int RenewalStatusId { get; set; }

        public string StatusName { get; set; } = null!;

        public bool IsActive { get; set; } = true;
    }
}
