import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Company } from "../../interfaces/company.interface";
import { upsertCompanyApi } from "../../api/company.api";

export const useUpsertCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Company) => upsertCompanyApi(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};