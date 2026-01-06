namespace Avinya.InsuranceCRM.Domain.Entities
{
    public class ClaimStageMaster
    {
        public int ClaimStageId { get; set; }
        public string StageName { get; set; }
        public bool IsActive { get; set; }
    }
}
