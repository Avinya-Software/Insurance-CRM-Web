import { useQuery } from "@tanstack/react-query";
import { getBrokerDropdownApi } from "../../api/broker.api";

export const useBrokerDropdown = () => {
  return useQuery({
    queryKey: ["brokerDropdown"],
    queryFn: getBrokerDropdownApi,
  });
};
