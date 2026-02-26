import { useQuery } from "@tanstack/react-query";
import { getCompanyWiseProductApi } from "../../api/policy.api";

export const useCompanyWiseProduct = (
  companyId?: string,
  insurance?: number
) => {
  return useQuery({
    queryKey: ["company-products", companyId, insurance],
    queryFn: () =>
      getCompanyWiseProductApi(companyId as string, insurance as number),
    enabled: !!companyId && !!insurance, // only call when both exist
  });
};