import { useQuery } from "@tanstack/react-query";
import { getBrokerFilterApi } from "../../api/broker.api";
import { BrokerPagedResponse } from "../../interfaces/broker.interface";

export const useBrokers = (
  pageNumber: number,
  pageSize: number,
  search?: string,
  status?: boolean
) => {
  return useQuery<BrokerPagedResponse>({
    queryKey: ["brokers", pageNumber, pageSize, search, status],
    queryFn: () => getBrokerFilterApi({ pageNumber, pageSize, search, status }),
  });
};
