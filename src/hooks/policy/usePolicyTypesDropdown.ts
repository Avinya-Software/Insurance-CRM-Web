import { useQuery } from "@tanstack/react-query";
import { getPolicyTypesDropdownApi } from "../../api/policy.api";

export const usePolicyTypesDropdown = () => {
  return useQuery({
    queryKey: ["policy-types-dropdown"],
    queryFn: getPolicyTypesDropdownApi,
    select: (res: any) => {
      console.log("Policy Types API raw response 👉", res);
      console.log("Policy Types data 👉", res?.data);

      return Array.isArray(res?.data) ? res.data : [];
    },
  });
};
