import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "../../api/product.api";

export const useProducts = (
  page: number,
  pageSize: number,
  policyType?: boolean,
  search?: string
) => {
  return useQuery({
    queryKey: ["products", page, pageSize, policyType, search],

    queryFn: () => getProductsApi(page, pageSize, policyType, search),

    select: (data) => ({
      products: data.data.data,
      totalRecords: data.data.totalRecords,
      totalPages: Math.ceil(data.data.totalRecords / pageSize),
      page: data.data.pageNumber,
      pageSize: data.data.pageSize,
    }),
  });
};