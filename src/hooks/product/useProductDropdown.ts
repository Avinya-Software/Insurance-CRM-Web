import { useQuery } from "@tanstack/react-query";
import { getProductDropdownApi } from "../../api/product.api";
import { ProductDropdown } from "../../interfaces/product.interface";

export const useProductDropdown = (insurerId?: string) => {
  return useQuery<ProductDropdown[]>({
    queryKey: ["product-dropdown", insurerId],
    queryFn: () => getProductDropdownApi(insurerId),
    enabled: !!insurerId, // ✅ runs only when insurerId exists
  });
};

