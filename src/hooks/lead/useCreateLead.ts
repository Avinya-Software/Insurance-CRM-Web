// useCreateLead.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { upsertLeadApi } from "../../api/lead.api";

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertLeadApi,

    onSuccess: (data) => {
      toast.success(data?.message ?? "Lead created successfully");

      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead-summary"] });
    },


    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create lead"
      );
    },
  });
};