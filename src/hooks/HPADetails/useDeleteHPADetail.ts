// src/hooks/HPADetails/useDeleteHPADetail.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHPADetailApi } from "../../api/HPADetails.api";

export const useDeleteHPADetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteHPADetailApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hpa-details"] });
    },
  });
};