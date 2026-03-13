import api from "./axios";
import { CompaniesApiResponse, Company } from "../interfaces/company.interface";


export const getCompaniesApi = async (
  page: number,
  pageSize: number,
  policyType?: boolean,
  search?: string
): Promise<CompaniesApiResponse> => {

  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (policyType !== undefined && policyType !== null) {
    params.append("policyType", policyType.toString());
  }

  if (search && search.trim() !== "") {
    params.append("search", search);
  }

  const res = await api.get<CompaniesApiResponse>(
    `/Companies/policy-type?${params.toString()}`
  );

  return res.data;
};

export const upsertCompanyApi = async (payload: Company) => {
    const res = await api.post("/Companies", payload);
    return res.data;
  };

  export const deleteCompanyApi = async (companyId: string) => {
    const res = await api.delete(`/Companies/${companyId}`);
    return res.data;
  };  