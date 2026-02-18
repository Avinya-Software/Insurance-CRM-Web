import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getClaimsApi } from "../../api/claim.api";
import type { ClaimFilters, PaginatedClaims } from "../../interfaces/claim.interface";

export const useClaims = (filters: ClaimFilters) => {
  return useQuery<PaginatedClaims>({
    queryKey: ["claims", filters],
    queryFn: () => getClaimsApi(filters),
    placeholderData: keepPreviousData, 
  });
};
