import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBrokerStatusApi } from "../../api/broker.api";
import toast from "react-hot-toast";

export const useUpdateBrokerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: number; status: boolean }) =>
      updateBrokerStatusApi(data),
    onSuccess: () => {
      toast.success("Broker status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["brokers"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.statusMessage || "Failed to update broker status");
    },
  });
};
