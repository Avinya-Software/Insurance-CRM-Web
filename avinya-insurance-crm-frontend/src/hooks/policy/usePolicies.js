import { useQuery } from "@tanstack/react-query";
import { getPoliciesApi } from "../../api/policy.api";
export const usePolicies = (filters) => {
    return useQuery({
        queryKey: ["policies", filters],
        queryFn: () => getPoliciesApi(filters),
        keepPreviousData: true,
    });
};
