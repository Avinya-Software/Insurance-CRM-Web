import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFamilyMemberStatusApi } from "../../api/family-member.api";
import { StatusUpdateRequest } from "../../interfaces/family-member.interface";
import toast from "react-hot-toast";

export const useUpdateFamilyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StatusUpdateRequest) => updateFamilyMemberStatusApi(data),
    onSuccess: (res, variables) => {
      // Step 1: Instantly update the UI state in the cache (Optimistic Update)
      queryClient.setQueryData(["family-members"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((member: any) =>
            member.familyMemberId === variables.familyMemberId
              ? { ...member, status: variables.status }
              : member
          ),
        };
      });
      // Step 2: Recalibrate with server data in background (Silently now)
      queryClient.invalidateQueries({ queryKey: ["family-members"] });
      toast.success(res.statusMessage || "Status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.statusMessage || "Failed to update status");
      // If it fails, we MUST invalidate to fix the UI (Snap toggle back)
      queryClient.invalidateQueries({ queryKey: ["family-members"] });
    },
  });
};
