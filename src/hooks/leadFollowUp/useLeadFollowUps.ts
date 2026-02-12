import { useQuery } from "@tanstack/react-query";
import { getFollowUpsByLeadId } from "../../api/leadFollowUp.api";

export const useLeadFollowUps = (leadId: string) => {
  return useQuery({
    queryKey: ["lead-followups", leadId],
    queryFn: () => getFollowUpsByLeadId(leadId),
    enabled: !!leadId,
  });
};