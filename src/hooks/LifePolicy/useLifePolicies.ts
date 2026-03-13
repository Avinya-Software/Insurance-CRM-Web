import { useQuery } from "@tanstack/react-query";
import { LifePolicyPagedResponse } from "../../interfaces/policy.interface";
import { getLifePoliciesApi } from "../../api/policy.api";

export const useLifePolicies = (filters: any) => {
  return useQuery<LifePolicyPagedResponse>({
    queryKey: ["life-policies", filters],
    queryFn: async () => {
      const res = await getLifePoliciesApi({
        pageNumber: filters.pageNumber,
        pageSize: filters.pageSize,
        search: filters.search,
        policyStatusId: filters.policyStatusId,
        statusId: filters.statusId,
        customerId: filters.customerId,
        insurerId: filters.insurerId,
        productId: filters.productId,
      });

      console.log("Life Policies API Response:", res);

      return res.data;
    },
  });
};