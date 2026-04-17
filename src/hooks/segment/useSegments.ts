import { useQuery } from "@tanstack/react-query";
import { getSegmentsApi } from "../../api/segment.api";

export const useSegments = (filters: {
  pageNumber: number;
  pageSize: number;
  getAll: boolean;
}) =>
  useQuery({
    queryKey: ["segments", filters],
    queryFn: () => getSegmentsApi(filters),
  });
