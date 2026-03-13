import { useQuery } from "@tanstack/react-query";
import { getCompanyWiseProductApi } from "../../api/policy.api";

export const useCompanyWiseProduct = (
  companyId?: string,
  insurance?: number,
  policyType?: number
) => {
  return useQuery({
    queryKey: ["company-products", companyId, insurance, policyType],
    queryFn: () =>
      getCompanyWiseProductApi(
        companyId as string,
        insurance,
        policyType
      ),
    enabled: !!companyId, // only companyId required
  });
};