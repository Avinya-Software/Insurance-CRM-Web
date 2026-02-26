import { useQuery } from "@tanstack/react-query";
import { getCompanyListApi } from "../../api/policy.api";

export const useCompanyList = () => {
  return useQuery({
    queryKey: ["company-list"],
    queryFn: getCompanyListApi,
  });
};