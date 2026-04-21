import { useQuery } from "@tanstack/react-query";
import { getSegmentsApi } from "../../api/segment.api";

export const useSegments = (filters: {
  pageNumber: number;
  pageSize: number;
  getAll: boolean;
  search?: string;
}) =>
  useQuery({
    queryKey: ["segments", filters.pageNumber, filters.pageSize, filters.getAll, filters.search],
    queryFn: () => getSegmentsApi(filters),
  });

