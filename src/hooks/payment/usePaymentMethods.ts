import { useQuery } from "@tanstack/react-query";
import { getPaymentMethodFilterApi } from "../../api/payment.api";
import { PaymentMethodPagedResponse } from "../../interfaces/payment.interface";

export const usePaymentMethods = (
  pageNumber: number,
  pageSize: number,
  search?: string
) => {
  return useQuery<PaymentMethodPagedResponse>({
    queryKey: ["payment-methods", pageNumber, pageSize, search],
    queryFn: () => getPaymentMethodFilterApi({ pageNumber, pageSize, search }),
  });
};
