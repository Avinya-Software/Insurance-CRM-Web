import api from "./axios";
import type {
  CreateCustomerRequest,
  CustomerDetails,
  CustomerDetailsResponse,
  CustomerResponse,
} from "../interfaces/customer.interface";

/*   CREATE / UPDATE CUSTOMER   */

export const createCustomerApi = async (data: CreateCustomerRequest) => {
  const res = await api.post("/Customer/CreateCustomer", data);
  return res.data;
};

export const uploadCustomerDocumentApi = async (data: FormData) => {
  const res = await api.post("/Customer/documents", data);
  return res.data;
};

/*   GET CUSTOMERS (PAGINATED)   */

export const getCustomersApi = async (params: {
  pageNumber: number;
  pageSize: number;
  search?: string;
}) => {
  const res = await api.get("/Customer", { params });
  console.log(res.data);
  return res.data.data;
};

/*   CUSTOMER DROPDOWN   */

export const getCustomerDropdownApi = async () => {
  const res = await api.get("/Customer/dropdown");
  return res.data;
};

/*   KYC PREVIEW   */

/* KYC PREVIEW */
export const previewKycFileApi = (fileUrl: string) => {
  console.log("Preview KYC file URL:", fileUrl);
  return fileUrl;
};

/* KYC DOWNLOAD */
export const downloadKycFileApi = (fileUrl: string) => {
  console.log("Download KYC file URL:", fileUrl);
  return fileUrl;
};


/*   KYC DELETE   */

export const deleteKycFileApi = async (
  customerId: string,
  documentId: string
) => {
  const res = await api.delete(
    `/Customer/${customerId}/kyc/${documentId}`
  );
  return res.data;
};

/*   DELETE CUSTOMER (BY ID)   */

export const deleteCustomerApi = async (
  customerId: string
) => {
  const res = await api.delete(
    `/Customer/${customerId}`
  );
  return res.data;
};


export const getCustomerDetailsApi = async (customerId: string): Promise<CustomerDetails> => {
  const res = await api.get<CustomerDetailsResponse>(`/Customer/${customerId}`);
  return res.data.data;
};