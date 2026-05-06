import { useQuery } from "@tanstack/react-query";
import { getFamilyMemberDropdownApi } from "../../api/family-member.api";

export const useFamilyMemberDropdown = (customerId?: string) => {
  return useQuery({
    queryKey: ["family-member-dropdown", customerId],
    queryFn: async () => {
       const res = await getFamilyMemberDropdownApi(customerId);
       return res.data;
    },
    enabled: !!customerId
  });
};
