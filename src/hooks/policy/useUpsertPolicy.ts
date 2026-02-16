import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertPolicyApi } from "../../api/policy.api";

type UpsertPolicyInput =
  | FormData
  | { policyId: string; policyStatusId: number };

export const useUpsertPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertPolicyInput) => {
      if (input instanceof FormData) {
        return upsertPolicyApi(input);
      }
      const formData = new FormData();
      formData.append("PolicyId", input.policyId);
      formData.append("PolicyStatusId", input.policyStatusId.toString());

      return upsertPolicyApi(formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
    },
  });
};
