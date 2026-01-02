import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomerApi } from "../../api/customer.api";
export const useCreateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createCustomerApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["customers"],
            });
        },
    });
};
