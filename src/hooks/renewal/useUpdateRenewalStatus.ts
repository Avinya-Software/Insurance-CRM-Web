import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRenewalStatusApi } from "../../api/renewal.api";

interface UpdateRenewalStatusPayload {
  id: string;
  renewalStatusId: number;
}

export const useUpdateRenewalStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRenewalStatusPayload) =>
      updateRenewalStatusApi(payload),

    onSuccess: () => {
      // 🔄 Re-fetch renewals list
      queryClient.invalidateQueries({
        queryKey: ["renewals"],
      });
    },
  });
};
