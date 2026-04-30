import { useQuery } from "@tanstack/react-query";
import { getGeneralPoliciesApi, getPoliciesApi, getGeneralPolicyByIdApi, getLifePolicyByIdApi } from "../../api/policy.api";
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
export const useGeneralPolicyById = (policyId: string | null) => {
  return useQuery({
    queryKey: ["general-policy", policyId],
    queryFn: async () => {
      if (!policyId) return null;
      const res = await getGeneralPolicyByIdApi(policyId);
      return res.data;
    },
    enabled: !!policyId,
  });
};

export const useLifePolicyById = (policyId: string | null) => {
  return useQuery({
    queryKey: ["life-policy", policyId],
    queryFn: async () => {
      if (!policyId) return null;
      const res = await getLifePolicyByIdApi(policyId);
      return res.data;
    },
    enabled: !!policyId,
  });
};
