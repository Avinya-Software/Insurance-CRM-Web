import { useQuery } from "@tanstack/react-query";
import { getCustomersApi } from "../../api/customer.api";
import type { CustomerPagedResponse } from "../../interfaces/customer.interface";

export const useCustomers = (pageNumber: number, pageSize: number, search?: string) => {
  return useQuery<CustomerPagedResponse>({
    queryKey: ["customers", pageNumber, pageSize, search],
    queryFn: async () => {
      const res = await getCustomersApi({ pageNumber, pageSize, search });
      console.log("API Response:", res);

      return {
        customers: res.data,            
        totalRecords: res.totalCount,   
        pageNumber: res.page,
        pageSize: res.pageSize,
        totalPages: res.totalPages,
        data: res.data,                 
      };
    },
  });
};
