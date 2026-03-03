import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertAddOnDetailApi } from "../../api/addOnDetails.api";
import { UpsertAddOnDetailRequest } from "../../interfaces/addondetails.interface";

export const useUpsertAddOnDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpsertAddOnDetailRequest) => upsertAddOnDetailApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addOnDetails"] });
    },
  });
};
