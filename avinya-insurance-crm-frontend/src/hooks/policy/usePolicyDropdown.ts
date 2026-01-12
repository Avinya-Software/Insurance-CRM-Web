import { useQuery } from "@tanstack/react-query";
import { getPolicyDropdownApi } from "../../api/policy.api";

export const usePolicyDropdown = (customerId?: string) => {
  return useQuery({
    queryKey: ["policy-dropdown", customerId], // 👈 IMPORTANT
    queryFn: () => getPolicyDropdownApi(customerId),
    staleTime: 5 * 60 * 1000,
    enabled: true, // always fetch (backend handles null)
  });
};
