import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCustomerApi,
  updateCustomerApi,
} from "../../api/customer.api";
import type { CreateCustomerRequest } from "../../interfaces/customer.interface";

export const useUpsertCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCustomerRequest) => {
      if (data.customerId) {
        return await updateCustomerApi(data);
      }

      return await createCustomerApi(data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },

    onError: (error: any) => {
      console.error("Save customer failed:", error);
    },
  });
};