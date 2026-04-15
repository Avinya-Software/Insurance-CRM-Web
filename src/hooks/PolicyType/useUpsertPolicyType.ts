import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertPolicyTypeApi } from "../../api/PolicyType.api";
import { UpsertPolicyTypeRequest } from "../../interfaces/PolicyType.interface";
import toast from "react-hot-toast";

export const useUpsertPolicyType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpsertPolicyTypeRequest) => upsertPolicyTypeApi(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["policy-types"] });
      toast.success(res.statusMessage || "Policy Type saved successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.statusMessage || "Failed to save Policy Type");
    },
  });
};
