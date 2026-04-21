import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLifeProductApi } from "../../api/product.api";
import toast from "react-hot-toast";

export const useAddLifeProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addLifeProductApi,
    onSuccess: (res) => {
      toast.success(res.statusMessage || "Life product saved successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.statusMessage || "Failed to save life product");
    },
  });
};
