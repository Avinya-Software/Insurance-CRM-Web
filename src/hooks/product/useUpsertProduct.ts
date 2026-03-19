import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertProductApi } from "../../api/product.api";

export const useUpsertProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      productId?: number;
      companyId: string;
      policyType: boolean;
      insurance: number;
      productName: string;
    }) => upsertProductApi(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};