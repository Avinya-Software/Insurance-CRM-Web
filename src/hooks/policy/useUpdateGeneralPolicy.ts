import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGeneralPolicyApi } from "../../api/policy.api";
import toast from "react-hot-toast";

export const useUpdateGeneralPolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ policyId, payload }: { policyId: string, payload: any }) => 
      updateGeneralPolicyApi(policyId, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["general-policies"] });
      // Optionally show toast here if preferred, but usually done in component
    },
    onError: (error: any) => {
      console.error("Update Policy Error =>", error);
    }
  });
};
