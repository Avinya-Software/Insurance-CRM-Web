import { useQuery } from "@tanstack/react-query";
import { getFamilyMemberDropdownApi } from "../../api/family-member.api";

export const useFamilyMemberDropdown = () => {
  return useQuery({
    queryKey: ["family-member-dropdown"],
    queryFn: async () => {
       const res = await getFamilyMemberDropdownApi();
       return res.data;
    }
  });
};
