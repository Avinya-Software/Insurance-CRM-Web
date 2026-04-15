import { useQuery } from "@tanstack/react-query";
import { getBankDropdownApi } from "../../api/bank.api";

export const useBankDropdown = () => {
  return useQuery({
    queryKey: ["bankDropdown"],
    queryFn: getBankDropdownApi,
  });
};
