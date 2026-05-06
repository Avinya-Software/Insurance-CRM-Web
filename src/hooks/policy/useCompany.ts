import { useQuery } from "@tanstack/react-query";
import { getCompanyListApi } from "../../api/policy.api";

export const useCompanyList = (policyType) => {
  return useQuery({
    queryKey: ["companyList", policyType],
    queryFn: () => getCompanyListApi(policyType),
  });
};
