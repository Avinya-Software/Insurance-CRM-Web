import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertBrokerApi } from "../../api/broker.api";
import { BrokerPayload } from "../../interfaces/broker.interface";

export const useUpsertBroker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BrokerPayload) => upsertBrokerApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brokerDropdown"] });
    },
  });
};
