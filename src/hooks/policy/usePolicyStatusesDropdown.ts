import { useQuery } from "@tanstack/react-query";
import { getPolicyStatusesDropdownApi } from "../../api/policy.api";

export const usePolicyStatusesDropdown = (type?: number) => {
  return useQuery({
    queryKey: ["policy-statuses-dropdown", type],
    queryFn: () => getPolicyStatusesDropdownApi(type),
    select: (data: any[]) =>
      (Array.isArray(data) ? data : []).map((item) => ({
        ...item,
        statusId: item.policyStatusId,   // normalize key
      })),
  });
};