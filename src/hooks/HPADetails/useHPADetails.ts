// src/hooks/HPADetails/useHPADetails.ts

import { useQuery } from "@tanstack/react-query";
import { HPADetail } from "../../interfaces/HPADetails.interface";
import { getHPADetailsApi } from "../../api/HPADetails.api";

export const useHPADetails = () => {
  return useQuery<HPADetail[]>({
    queryKey: ["hpa-details"],
    queryFn: getHPADetailsApi,
  });
};