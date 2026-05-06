import { useQuery } from "@tanstack/react-query";
import { getPolicyTypeDropdownApi } from "../../api/PolicyType.api";

export const usePolicyTypeDropdown = (divisionId: number, segmentId: number) => {
  return useQuery({
    queryKey: ["policy-type-dropdown", divisionId, segmentId],
    queryFn: () => getPolicyTypeDropdownApi(divisionId, segmentId),
    enabled: !!divisionId && !!segmentId,
  });
};
