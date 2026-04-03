import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFamilyMemberApi } from "../../api/family-member.api";
import toast from "react-hot-toast";

export const useDeleteFamilyMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFamilyMemberApi(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["family-members"] });
      toast.success(res.statusMessage || "Family member deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.statusMessage || "Failed to delete member");
    },
  });
};
