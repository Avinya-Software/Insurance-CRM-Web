import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateCustomerRequest } from "../../interfaces/customer.interface";
import { createCustomerApi } from "../../api/customer.api";

export const useUpsertCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCustomerRequest) => {
      const payload = { ...data };

      if (payload.customerId) {
        return await createCustomerApi(payload);
      }

      delete payload.customerId;
      return await createCustomerApi(payload); 
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },

    onError: (error: any, variables) => {
      console.error("Save customer failed:", error);

      if (variables.customerId) {
        toast.error("Customer update failed");
      } else {
        toast.error("Customer creation failed");
      }
    },
  });
};