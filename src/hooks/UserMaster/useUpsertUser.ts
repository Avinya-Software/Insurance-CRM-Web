import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPayload } from "../../interfaces/UserMaster.interface";
import toast from "react-hot-toast";
import { upsertUserApi } from "../../api/UserMaster.api";

export const useUpsertUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserPayload) => upsertUserApi(data),
    onSuccess: (res) => {
      toast.success(res.statusMessage || "User saved successfully");
      queryClient.invalidateQueries({ queryKey: ["userMaster"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.statusMessage || "Failed to save user");
    },
  });
};
