import { useQuery } from "@tanstack/react-query";
import { getBankFilterApi } from "../../api/bank.api";

export const useBanks = (filters: { pageNumber: number, pageSize: number, search?: string }) => {
  return useQuery({
    queryKey: ["banks", filters.pageNumber, filters.pageSize, filters.search],
    queryFn: () => getBankFilterApi(filters),
  });
};
