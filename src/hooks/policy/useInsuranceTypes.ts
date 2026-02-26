import { useQuery } from "@tanstack/react-query";
import { getInsuranceTypesApi } from "../../api/policy.api";

export const useInsuranceTypes = () => {
  return useQuery({
    queryKey: ["insurance-types"],
    queryFn: getInsuranceTypesApi,
  });
};