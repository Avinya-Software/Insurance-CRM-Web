import { useQuery } from "@tanstack/react-query";
import { getCompaniesApi } from "../../api/company.api";

export const useCompanies = (
  page: number,
  pageSize: number,
  policyType?: boolean,
  search?: string
) => {
  return useQuery({
    queryKey: ["companies", page, pageSize, policyType, search],

    queryFn: () => getCompaniesApi(page, pageSize, policyType, search),

    select: (data) => ({
      companies: data.data.data,
      totalRecords: data.data.totalRecords,
      totalPages: data.data.totalPages,
      page: data.data.page,
      pageSize: data.data.pageSize,
    }),
  });
};