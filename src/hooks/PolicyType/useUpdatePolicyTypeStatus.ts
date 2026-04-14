import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePolicyTypeStatusApi } from "../../api/PolicyType.api";
import { UpdatePolicyTypeStatusRequest } from "../../interfaces/PolicyType.interface";
import toast from "react-hot-toast";

export const useUpdatePolicyTypeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePolicyTypeStatusRequest) => updatePolicyTypeStatusApi(data),
    onSuccess: (res, variables) => {
      queryClient.setQueryData(["policy-types"], (old: any) => {
        if (!old) return old;
        return old.map((type: any) =>
          type.id === variables.id
            ? { ...type, status: variables.status }
            : type
        );
      });
      queryClient.invalidateQueries({ queryKey: ["policy-types"] });
      toast.success(res.statusMessage || "Status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.statusMessage || "Failed to update status");
      queryClient.invalidateQueries({ queryKey: ["policy-types"] });
    },
  });
};
