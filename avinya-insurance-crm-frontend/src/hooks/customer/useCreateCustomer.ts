import { useMutation } from "@tanstack/react-query";
import { createCustomerApi } from "../../api/customer.api";
import type { CreateCustomerRequest } from "../../interfaces/customer.interface";

export const useCreateCustomer = () => {
  return useMutation({
    mutationFn: (data: CreateCustomerRequest) =>
      createCustomerApi(data),
  });
};
