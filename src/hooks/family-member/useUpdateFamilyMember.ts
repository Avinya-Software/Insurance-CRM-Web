import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFamilyMemberApi } from "../../api/family-member.api";
import toast from "react-hot-toast";

export const useUpdateFamilyMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => updateFamilyMemberApi(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["family-members"] });
      toast.success(res.statusMessage || "Family member updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.statusMessage || "Failed to update family member.");
    },
  });
};
