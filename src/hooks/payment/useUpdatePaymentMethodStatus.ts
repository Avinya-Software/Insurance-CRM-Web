import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePaymentMethodStatusApi } from "../../api/payment.api";

export const useUpdatePaymentMethodStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: number; status: boolean }) =>
      updatePaymentMethodStatusApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });
};
