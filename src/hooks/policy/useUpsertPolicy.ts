import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertPolicyApi, UpsertPolicyPayload } from "../../api/policy.api";

export const useUpsertPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertPolicyPayload) => upsertPolicyApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
    },
  });
};
