import { useQuery } from "@tanstack/react-query";
import { getBankFilterApi } from "../../api/bank.api";

export const useBanks = (filters: any) => {
  return useQuery({
    queryKey: ["banks", filters],
    queryFn: () => getBankFilterApi(filters),
  });
};
