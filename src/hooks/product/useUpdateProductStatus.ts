import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductStatusApi } from "../../api/product.api";
import toast from "react-hot-toast";

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: number; status: boolean }) =>
      updateProductStatusApi(data),

    onSuccess: () => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onError: () => {
      toast.error("Failed to update status");
    },
  });
};
