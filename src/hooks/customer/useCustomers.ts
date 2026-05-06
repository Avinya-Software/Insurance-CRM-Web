import { useQuery } from "@tanstack/react-query";
import { getCustomersApi } from "../../api/customer.api";
import type { CustomerPagedResponse } from "../../interfaces/customer.interface";

export const useCustomers = (
  pageNumber: number,
  pageSize: number,
  search?: string
) => {
  return useQuery<CustomerPagedResponse>({
    queryKey: ["customers", pageNumber, pageSize, search],
    queryFn: async () => {
      const res = await getCustomersApi({
        pageNumber,
        pageSize,
        search,
      });

      console.log("API Response:", res);

      return {
        customers: res.data ?? [],
        totalRecords: res.totalCount ?? 0,
        pageNumber: res.page ?? 1,
        pageSize: res.pageSize ?? pageSize,
        totalPages: res.totalPages ?? 1,
        data: res.data ?? [],
      };
    },
  });
};