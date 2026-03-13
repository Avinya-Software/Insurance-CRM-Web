// src/hooks/HPADetails/useUpsertHPADetail.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertHPADetailApi } from "../../api/HPADetails.api";
import { UpsertHPADetailRequest } from "../../interfaces/HPADetails.interface";

export const useUpsertHPADetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertHPADetailRequest) =>
      upsertHPADetailApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hpa-details"] });
    },
  });
};