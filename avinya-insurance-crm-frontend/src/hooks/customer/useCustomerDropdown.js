import { useQuery } from "@tanstack/react-query";
import { getCustomerDropdownApi } from "../../api/customer.api";
export const useCustomerDropdown = () => {
    return useQuery({
        queryKey: ["customer-dropdown"],
        queryFn: getCustomerDropdownApi,
    });
};
