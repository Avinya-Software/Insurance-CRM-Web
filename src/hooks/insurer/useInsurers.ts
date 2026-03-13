import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getInsurersApi } from "../../api/insurer.api";
import { InsurerListResponse } from "../../interfaces/insurer.interface";

interface UseInsurersParams {
  pageNumber: number;
  pageSize: number;
  search?: string;
}

export const useInsurers = ({
  pageNumber,
  pageSize,
  search,
}: UseInsurersParams) => {
  return useQuery<InsurerListResponse>({
    queryKey: ["insurers", pageNumber, pageSize, search],
    queryFn: () =>
      getInsurersApi(pageNumber, pageSize, search),
    placeholderData: keepPreviousData,
  });
};
