import { useQuery } from "@tanstack/react-query";
import { getPolicyModeDropdownApi } from "../../api/policy.api";

export const usePolicyModeDropdown = (policyType: number) => {
  return useQuery({
    queryKey: ["policy-mode-dropdown", policyType],
    queryFn: () => getPolicyModeDropdownApi(policyType),
  });
};
