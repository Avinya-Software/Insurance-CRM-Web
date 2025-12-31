import { useQuery } from "@tanstack/react-query";
import { getInsurersApi } from "../../api/insurer.api";
import type { InsurerFilters } from "../../api/insurer.api";

export const useInsurers = (filters: InsurerFilters) => {
  return useQuery({
    queryKey: ["insurers", filters],
    queryFn: () => getInsurersApi(filters),
    keepPreviousData: true,
  });
};
