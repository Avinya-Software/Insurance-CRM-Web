import api from "./axios";
import type { CreateCustomerRequest, CustomerResponse } from "../interfaces/customer.interface";

export const createCustomerApi = async (data: CreateCustomerRequest) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "kycFiles" && Array.isArray(value)) {
        value.forEach(file => formData.append("kycFiles", file));
      } else {
        formData.append(key, value as string);
      }
    }
  });

  const res = await api.post<CustomerResponse>("/Customer", formData);
  return res.data;
};
