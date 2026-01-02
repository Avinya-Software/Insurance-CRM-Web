import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "../../api/product.api";
export const useProducts = (filters) => {
    return useQuery({
        queryKey: ["products", filters],
        queryFn: () => getProductsApi(filters),
        keepPreviousData: true,
    });
};
