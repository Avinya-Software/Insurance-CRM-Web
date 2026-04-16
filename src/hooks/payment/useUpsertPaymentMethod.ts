import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertPaymentMethodApi } from "../../api/payment.api";
import toast from "react-hot-toast";

export const useUpsertPaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertPaymentMethodApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success(res.statusMessage || "Payment method added successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add payment method");
    },
  });
};
