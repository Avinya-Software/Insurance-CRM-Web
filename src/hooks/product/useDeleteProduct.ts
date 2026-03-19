import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductApi } from "../../api/product.api";
import toast from "react-hot-toast";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => deleteProductApi(productId),

    onSuccess: () => {
      toast.success("Product deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: () => {
      toast.error("Failed to delete product");
    },
  });
};