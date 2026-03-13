import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserApi } from "../../api/UserMaster.api";
import { UpdateUserRequest } from "../../interfaces/UserMaster.interface";
import toast from "react-hot-toast";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUserApi(data),

    onSuccess: () => {
      toast.success("User updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["userMaster"],
      });
    },
  });
};