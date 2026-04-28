import { useQuery } from "@tanstack/react-query";
import { getClaimHistoryApi } from "../../api/claim.api";

export const useClaimHistory = (claimId: string) => {
  return useQuery({
    queryKey: ["claim-history", claimId],
    queryFn: () => getClaimHistoryApi(claimId),
    enabled: !!claimId,
  });
};
