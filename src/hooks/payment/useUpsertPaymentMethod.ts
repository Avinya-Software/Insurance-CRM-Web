import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertPaymentMethodApi } from "../../api/payment.api";

export const useUpsertPaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertPaymentMethodApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethodDropdown"] });
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });
};
