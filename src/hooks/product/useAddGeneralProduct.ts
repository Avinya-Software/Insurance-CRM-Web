import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addGeneralProductApi } from "../../api/product.api";
import toast from "react-hot-toast";

export const useAddGeneralProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addGeneralProductApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["productDropdown"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add product");
    },
  });
};
