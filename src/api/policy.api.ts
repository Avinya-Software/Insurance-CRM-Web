import { CustomerDropdown } from "../interfaces/customer.interface";
import type { AgencyDropdown, GeneralPolicyFilters, GeneralPolicyResponse, IGeneralPolicy, InsuranceTypeResponse, LifePolicyPagedResponse, PoliciesResponse, PolicyByCustomerDropdownDto, UpsertLifePolicyPayload, UserDropdown } from "../interfaces/policy.interface";
import axios from "./axios";
import api from "./axios";

/*   UPSERT POLICY   */

export const upsertPolicyApi = async (payload: any) => {
  // Since the backend uses [FromBody], we send a plain JSON object
  const res = await api.post("/GeneralPolicy/add", payload);
  return res.data;
};

/*   GET POLICIES   */

export const getPoliciesApi = async (params: {
  pageNumber: number;
  pageSize: number;
  search?: string;
  policyStatusId?: number | null;
  policyTypeId?: number | null;
  customerId?: string;
  insurerId?: string;
  productId?: string;
}): Promise<PoliciesResponse> => {
  const res = await api.get<PoliciesResponse>("/policy", { params });
  return res.data;
};

/*   DROPDOWNS   */

export const getPolicyTypesDropdownApi = async () => {
  const res = await api.get("/policy/policy-types-dropdown");
  return res.data.data;
};

export const getPolicyStatusesDropdownApi = async (type?: number) => {
  const res = await api.get("/policy/policy-statuses-dropdown", {
    params: type ? { type } : {},
  });

  return res.data.data;
};
/*   POLICY DOCUMENT PREVIEW   */

export const previewPolicyDocumentApi = (
  policyId: string,
  documentId: string
) => {
  return `${api.defaults.baseURL}/policy/${policyId}/documents/${documentId}/preview`;
};

/*   POLICY DOCUMENT DOWNLOAD   */

export const downloadPolicyDocumentApi = (
  policyId: string,
  documentId: string
) => {
  return `${api.defaults.baseURL}/policy/${policyId}/documents/${documentId}/download`;
};

/*   POLICY DOCUMENT DELETE   */

export const deletePolicyDocumentApi = async (
  policyId: string,
  documentId: string
) => {
  const res = await api.delete(
    `/policy/${policyId}/documents/${documentId}`
  );
  return res.data;
};

/*   GENERAL POLICY DOCUMENT DELETE   */

export const deleteGeneralPolicyDocumentApi = async (
  policyId: string,
  documentId: string
) => {
  const res = await api.delete(
    `/GeneralPolicy/${policyId}/documents/${documentId}`
  );
  return res.data;
};

/*   DELETE POLICY (BY ID)   */

export const deletePolicyApi = async (
  policyId: string
) => {
  const res = await api.delete(
    `/policy/${policyId}`
  );
  return res.data;
};
export interface PolicyDropdownItem {
  id: string;
  policyNumber: string;
  policyCode?: string | null;
  renewalDate?: string | null;
  premiumGross?: number | null;
}

export const getPolicyDropdownApi = async (
  customerId?: string
) => {
  const res = await api.get(
    "/policy/policy-dropdown",
    {
      params: customerId ? { customerId } : {},
    }
  );

  return res.data?.data || [];
};

export const updatePolicyStatusApi = async (
  policyId: string,
  statusId: number
) => {
  const formData = new FormData();
  formData.append("PolicyId", policyId);
  formData.append("PolicyStatusId", statusId.toString());

  const res = await upsertPolicyApi(formData);
  return res;
};

export const getPoliciesByCustomerApi = async (
  customerId: string
): Promise<PolicyByCustomerDropdownDto[]> => {
  const res = await api.get("/policy/by-customer/" + customerId);

  return res.data?.data || [];
};

export const getInsuranceTypesApi = async () => {
  const res = await api.get<InsuranceTypeResponse>(
    "/Insurer/InsuranceType"
  );

  return res.data.data;
};

export const getCompanyListApi = async (policyType?: boolean | null) => {
  let url = "/Companies/CompanyList";

  if (policyType !== null && policyType !== undefined) {
    url += `?policyType=${policyType}`;
  }

  const res = await api.get(url);
  return res.data?.data || [];
};

export const getCompanyWiseProductApi = async (
  companyId: string,
  insurance?: number,
  policyType?: number
) => {
  const res = await api.get("/products/CompanyWiseProduct", {
    params: {
      companyId,
      ...(insurance !== undefined ? { insurance } : {}),
      ...(policyType !== undefined ? { policyType } : {}),
    },
  });

  return res.data?.data || [];
};

export const getAddOnDetailsApi = async (insuranceTypeId: number) => {
  const res = await api.get("/AddOnDetail", {
    params: { insuranceTypeId },
  });

  return res.data?.data || [];
};

export const getCustomerDropdownApi = async (): Promise<CustomerDropdown[]> => {
  const res = await api.get("/Customer/dropdown");
  return res.data?.data || [];
};

export const getAgencyDropdownApi = async (): Promise<AgencyDropdown[]> => {
  const res = await api.get("/Agency/Agency-dropdown");
  return res.data?.data || [];
}

export const getUserDropdownApi = async (): Promise<UserDropdown[]> => {
  const res = await api.get("/UserMaster/User-dropdown");
  return res.data?.data || [];
}

export const getLifePoliciesApi = async (params: {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  policyStatusId?: number | null;
  statusId?: number | null;
  customerId?: string | null;
  insurerId?: string | null;
  productId?: string | null;
}) => {
  const res = await api.get("/policy/life-policy", { params });
  return res.data;
};

export const upsertLifePolicyApi = async (payload: UpsertLifePolicyPayload) => {
  const response = await axios.post("/policy/upsert-life-policy", payload);
  return response.data;
};

export const uploadPolicyDocumentApi = async (data: FormData) => {
  const res = await api.post("/Customer/documents", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getGeneralPoliciesApi = async (params: GeneralPolicyFilters): Promise<GeneralPolicyResponse> => {
  const res = await api.get<GeneralPolicyResponse>("/GeneralPolicy/filter", { params });
  return res.data;
};

export const updateGeneralPolicyApi = async (policyId: string, payload: any) => {
  const res = await api.put(`/GeneralPolicy/update/${policyId}`, payload);
  return res.data;
};

export const deleteGeneralPolicyApi = async (policyId: string) => {
  const res = await api.delete(`/GeneralPolicy/delete/${policyId}`);
  return res.data;
};
export const getGeneralPolicyByIdApi = async (policyId: string): Promise<{ data: IGeneralPolicy }> => {
  const res = await api.get(`/GeneralPolicy/${policyId}`);
  return res.data;
};
