import { useQuery } from "@tanstack/react-query";
import { getFollowUpsByLeadId } from "../../api/leadFollowUp.api";
import { LeadFollowUp } from "../../interfaces/leadFollowUp.interface";

export const useLeadFollowUps = (leadId: string) => {
  return useQuery<LeadFollowUp[]>({
    queryKey: ["lead-followups", leadId],
    queryFn: () => getFollowUpsByLeadId(leadId),
    enabled: !!leadId,
  });
};