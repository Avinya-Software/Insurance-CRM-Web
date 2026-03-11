import { useQuery } from "@tanstack/react-query";
import { LifePolicyPagedResponse } from "../../interfaces/policy.interface";
import { getLifePoliciesApi } from "../../api/policy.api";

export const useLifePolicies = (
  pageNumber: number,
  pageSize: number,
  search?: string
) => {
  return useQuery<LifePolicyPagedResponse>({
    queryKey: ["life-policies", pageNumber, pageSize, search],

    queryFn: async () => {
      const res = await getLifePoliciesApi({
        pageNumber,
        pageSize,
        search,
      });

      console.log("Life Policies API Response:", res);

      return res.data;
    },
  });
};