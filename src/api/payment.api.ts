import api from "./axios";

export const getPaymentMethodDropdownApi = async () => {
  const res = await api.get("/PaymentMethod/dropdown");
  return res.data?.data || [];
};

export const upsertPaymentMethodApi = async (data: any) => {
  const res = await api.post("/PaymentMethod/add", data);
  return res.data;
};

export const getPaymentMethodFilterApi = async (params: {
  pageNumber: number;
  pageSize: number;
  search?: string;
}) => {
  const res = await api.get("/PaymentMethod/filter", { params });
  return res.data;
};

export const updatePaymentMethodStatusApi = async (data: { id: number; status: boolean }) => {
  const res = await api.put("/PaymentMethod/status", data);
  return res.data;
};
