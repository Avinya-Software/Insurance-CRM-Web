import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteGeneralPolicyApi } from "../../api/policy.api";

export const useDeletePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (policyId: string) =>
      deleteGeneralPolicyApi(policyId),

    onSuccess: (res) => {
      toast.success(res?.statusMessage || "Policy deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["general-policies"] });
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.statusMessage || 
        err?.response?.data?.message || 
        "Failed to delete policy"
      );
    },
  });
};
