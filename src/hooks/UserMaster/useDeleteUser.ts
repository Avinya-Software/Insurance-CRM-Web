import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteUserApi } from "../../api/UserMaster.api";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUserApi(id),
    onSuccess: (res) => {
      toast.success(res.statusMessage || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["userMaster"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.statusMessage || "Failed to delete user");
    },
  });
};
