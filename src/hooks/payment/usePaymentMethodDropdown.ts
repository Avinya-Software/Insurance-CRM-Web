import { useQuery } from "@tanstack/react-query";
import { getPaymentMethodDropdownApi } from "../../api/payment.api";

export const usePaymentMethodDropdown = () => {
  return useQuery({
    queryKey: ["paymentMethodDropdown"],
    queryFn: getPaymentMethodDropdownApi,
  });
};
