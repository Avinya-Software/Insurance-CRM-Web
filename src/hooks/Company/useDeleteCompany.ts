import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCompanyApi } from "../../api/company.api";
import toast from "react-hot-toast";

export const useDeleteCompany = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) => deleteCompanyApi(companyId),

    onSuccess: () => {
      toast.success("Company deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["companies"],
      });
    },

    onError: () => {
      toast.error("Failed to delete company");
    },
  });
};