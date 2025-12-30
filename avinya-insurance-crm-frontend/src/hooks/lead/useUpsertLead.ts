import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertLeadApi } from "../../api/lead.api";

export const useUpsertLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertLeadApi,
    onSuccess: () => {
      // refresh lead list
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};