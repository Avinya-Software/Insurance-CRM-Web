import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBankStatusApi } from "../../api/bank.api";

export const useUpdateBankStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: number; status: boolean }) => updateBankStatusApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banks"] });
    },
  });
};
