import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAddOnDetailApi } from "../../api/addOnDetails.api";

export const useDeleteAddOnDetail = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (id: string) => deleteAddOnDetailApi(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["addOnDetails"] });
      },
    });
  };
