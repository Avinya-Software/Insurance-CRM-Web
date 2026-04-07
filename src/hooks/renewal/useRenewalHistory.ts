import { useQuery } from "@tanstack/react-query";
import { getRenewalHistoryApi } from "../../api/renewal-history.api";

export const useRenewalHistory = (policyId: string) => {
  return useQuery({
    queryKey: ["renewal-history", policyId],
    queryFn: () => getRenewalHistoryApi(policyId),
    enabled: !!policyId,
  });
};
