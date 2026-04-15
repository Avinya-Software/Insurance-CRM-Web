import { useQuery } from "@tanstack/react-query";
import { getProductDropdownApi } from "../../api/product.api";

export const useProductDropdown = (
  divisionId?: string | number,
  companyId?: string,
  segmentId?: string | number
) => {
  return useQuery({
    queryKey: ["productDropdown", divisionId, companyId, segmentId],
    queryFn: () => getProductDropdownApi(divisionId, companyId, segmentId),
    enabled: !!divisionId && !!companyId && !!segmentId,
  });
};
