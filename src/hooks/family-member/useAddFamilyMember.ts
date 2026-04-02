import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFamilyMemberApi } from "../../api/family-member.api";
import toast from "react-hot-toast";

export const useAddFamilyMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => addFamilyMemberApi(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["family-members"] });
      toast.success(res.statusMessage || "Family member added successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.statusMessage || "Failed to add family member.");
    },
  });
};
