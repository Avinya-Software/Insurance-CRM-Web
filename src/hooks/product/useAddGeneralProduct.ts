import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addGeneralProductApi } from "../../api/product.api";
import toast from "react-hot-toast";

export const useAddGeneralProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addGeneralProductApi,
    onSuccess: (res) => {
      toast.success(res.statusMessage || "General product added successfully");
      queryClient.invalidateQueries({ queryKey: ["productDropdown"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.statusMessage || "Failed to add product");
    },
  });
};
