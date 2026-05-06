import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBranchStatusApi } from "../../api/branch.api";

export const useUpdateBranchStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: number; status: boolean }) => updateBranchStatusApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};
