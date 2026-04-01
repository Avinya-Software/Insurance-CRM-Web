import { useQuery } from "@tanstack/react-query";
import { getGeneralPoliciesApi, getPoliciesApi } from "../../api/policy.api";
import type { Policy, PoliciesResponse, GeneralPolicyFilters, GeneralPolicyResponse } from "../../interfaces/policy.interface";

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

export const useGeneralPolicies = (filters: GeneralPolicyFilters) => {
  return useQuery({
    queryKey: ["general-policies", filters],
    queryFn: async () => {
      const res: GeneralPolicyResponse = await getGeneralPoliciesApi(filters);
      return res.data;
    },
  });
};
