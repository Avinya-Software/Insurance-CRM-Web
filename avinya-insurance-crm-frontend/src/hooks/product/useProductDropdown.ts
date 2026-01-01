import { useQuery } from "@tanstack/react-query";
import { getProductDropdownApi } from "../../api/product.api";

export const useProductDropdown = (insurerId?: string) => {
  return useQuery({
    queryKey: ["product-dropdown", insurerId],
    queryFn: () => getProductDropdownApi(insurerId),
    enabled: !!insurerId, // 🔥 API runs ONLY after insurer selected
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
};
