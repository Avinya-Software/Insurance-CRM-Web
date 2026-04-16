import api from "./axios";

export const getPaymentMethodDropdownApi = async () => {
  const res = await api.get("/PaymentMethod/dropdown");
  return res.data?.data || [];
};

export const upsertPaymentMethodApi = async (data: any) => {
  const res = await api.post("/PaymentMethod/add", data);
  return res.data;
};
