import { useQuery } from "@tanstack/react-query";
import { getCompanyListApi } from "../../api/policy.api";

export const useCompanyDropdown = (policyType?: boolean | null) => {
  return useQuery({
    queryKey: ["companyList", policyType ?? "all"],
    queryFn: () => getCompanyListApi(policyType),
  });
};
