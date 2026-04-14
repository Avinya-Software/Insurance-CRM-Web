import { useQuery } from "@tanstack/react-query";
import { getPolicyTypesApi } from "../../api/PolicyType.api";

export const usePolicyTypes = () => {
  return useQuery({
    queryKey: ["policy-types"],
    queryFn: getPolicyTypesApi,
  });
};
