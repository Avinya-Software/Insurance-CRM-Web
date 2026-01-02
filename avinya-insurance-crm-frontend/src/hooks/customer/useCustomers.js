import { useQuery } from "@tanstack/react-query";
import { getCustomersApi } from "../../api/customer.api";
export const useCustomers = (pageNumber, pageSize, search) => {
    return useQuery({
        queryKey: ["customers", pageNumber, pageSize, search],
        queryFn: () => getCustomersApi({
            pageNumber,
            pageSize,
            search,
        }),
        keepPreviousData: true,
    });
};
