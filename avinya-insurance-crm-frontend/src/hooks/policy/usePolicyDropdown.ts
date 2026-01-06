import { useQuery } from "@tanstack/react-query";
import { getPolicyDropdownApi } from "../../api/policy.api";

export const usePolicyDropdown = () => {
  return useQuery({
    queryKey: ["policy-dropdown"],
    queryFn: getPolicyDropdownApi,
    staleTime: 5 * 60 * 1000, // cache for 5 mins
  });
};
