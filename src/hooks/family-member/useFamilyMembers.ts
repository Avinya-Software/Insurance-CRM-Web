import { useQuery } from "@tanstack/react-query";
import { getFamilyMembersApi } from "../../api/family-member.api";
import { FamilyMemberFilterParams } from "../../interfaces/family-member.interface";

export const useFamilyMembers = (params: FamilyMemberFilterParams) => {
  return useQuery({
    queryKey: ["family-members", params],
    queryFn: () => getFamilyMembersApi(params),
  });
};
