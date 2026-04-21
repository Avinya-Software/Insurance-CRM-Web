import { useQuery } from "@tanstack/react-query";
import { getBranchFilterApi } from "../../api/branch.api";

export const useBranches = (filters: { pageNumber: number, pageSize: number, search?: string }) => {
  return useQuery({
    queryKey: ["branches", filters.pageNumber, filters.pageSize, filters.search],
    queryFn: () => getBranchFilterApi(filters),
  });
};
