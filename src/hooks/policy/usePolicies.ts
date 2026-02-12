import { useQuery } from "@tanstack/react-query";
import { getPoliciesApi } from "../../api/policy.api";
import type { Policy, PoliciesResponse } from "../../interfaces/policy.interface";

export interface PolicyFilters {
  pageNumber: number;
  pageSize: number;
  search?: string;
}

export const usePolicies = (filters: PolicyFilters) => {
  return useQuery({
    queryKey: ["policies", filters],
    queryFn: async () => {
      const res: PoliciesResponse = await getPoliciesApi(filters);
      return res.data; 
    },
  });
};
