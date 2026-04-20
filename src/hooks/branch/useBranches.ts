import { useQuery } from "@tanstack/react-query";
import { getBranchFilterApi } from "../../api/branch.api";

export const useBranches = (filters: any) => {
  return useQuery({
    queryKey: ["branches", filters],
    queryFn: () => getBranchFilterApi(filters),
  });
};
