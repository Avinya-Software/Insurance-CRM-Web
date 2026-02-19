import { useQuery } from "@tanstack/react-query";
import { getPoliciesByCustomerApi } from "../../api/policy.api";

export const usePoliciesByCustomer = (customerId?: string) =>
  useQuery({
    queryKey: ["policies-by-customer", customerId],
    queryFn: () => getPoliciesByCustomerApi(customerId!),
    enabled: !!customerId,
  });
