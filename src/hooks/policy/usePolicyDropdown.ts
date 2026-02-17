import { useQuery } from "@tanstack/react-query";
import { getPolicyDropdownApi } from "../../api/policy.api";

export const usePolicyDropdown = (customerId?: string) => {
  return useQuery({
    queryKey: ["policy-dropdown", customerId],
    queryFn: () => getPolicyDropdownApi(customerId),
    enabled: !!customerId, 
  });
};

