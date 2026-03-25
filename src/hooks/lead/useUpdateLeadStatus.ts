// useUpdateLeadStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeadStatusApi } from "../../api/lead.api";

interface UpdateLeadStatusPayload {
  leadId: string;
  statusId: string; // change from number to string
  notes?: string;
}

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, statusId, notes }: UpdateLeadStatusPayload) =>
      updateLeadStatusApi(leadId, statusId, notes),

    onSuccess: () => {
      // Invalidate leads query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead-details"] }); // optional: refresh details
    },
  });
};