import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertBranchApi } from "../../api/branch.api";
import { BranchPayload } from "../../interfaces/branch.interface";

export const useUpsertBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BranchPayload) => upsertBranchApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branchDropdown"] });
    },
  });
};
