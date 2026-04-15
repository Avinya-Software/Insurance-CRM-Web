import { useQuery } from "@tanstack/react-query";
import { getBranchDropdownApi } from "../../api/branch.api";

export const useBranchDropdown = () => {
  return useQuery({
    queryKey: ["branchDropdown"],
    queryFn: getBranchDropdownApi,
  });
};
