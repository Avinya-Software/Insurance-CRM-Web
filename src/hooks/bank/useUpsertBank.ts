import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertBankApi } from "../../api/bank.api";
import toast from "react-hot-toast";

export const useUpsertBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertBankApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["bankDropdown"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add bank");
    },
  });
};
