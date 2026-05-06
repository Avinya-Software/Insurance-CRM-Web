import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateClaimStatusApi } from "../../api/claim.api";

export const useUpdateClaimStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { claimId: string; statusId: number; statusName?: string }) =>
      updateClaimStatusApi({ claimId: data.claimId, statusId: data.statusId }),

    onSuccess: (res: any, variables) => {
      toast.success(res?.statusMessage || "Claim status updated successfully");

      // 🔄 Update local cache manually instead of refetching
      queryClient.setQueriesData({ queryKey: ["claims"] }, (oldData: any) => {
        if (!oldData) return oldData;

        // Handle both paginated and regular array structures
        const updateList = (list: any[]) =>
          list.map((claim) =>
            claim.claimId === variables.claimId
              ? {
                  ...claim,
                  claimStatus: variables.statusId,
                  claimStatusName: variables.statusName || claim.claimStatusName,
                }
              : claim
          );

        if (oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: updateList(oldData.data),
          };
        }

        if (Array.isArray(oldData)) {
          return updateList(oldData);
        }

        return oldData;
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.statusMessage ||
          error?.response?.data ||
          "Failed to update claim status"
      );
    },
  });
};
