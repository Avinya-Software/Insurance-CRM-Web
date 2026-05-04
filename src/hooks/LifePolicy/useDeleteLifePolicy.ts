import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePolicyApi } from "../../api/policy.api";

export const useDeleteLifePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (policyId: string) =>
      deletePolicyApi(policyId),

    onSuccess: (res) => {
      toast.success(res?.statusMessage || "Life Policy deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["life-policies"] });
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.statusMessage || 
        err?.response?.data?.message || 
        "Failed to delete life policy"
      );
    },
  });
};
