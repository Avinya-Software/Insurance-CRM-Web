// useUpdateLead.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateLeadApi } from "../../api/lead.api";

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateLeadApi(id, payload),

    onSuccess: (data) => {
      toast.success(data?.message ?? "Lead updated successfully");

      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead-summary"] });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update lead"
      );
    },
  });
};