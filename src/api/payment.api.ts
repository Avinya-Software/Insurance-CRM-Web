import api from "./axios";

export const getPaymentMethodDropdownApi = async () => {
  const res = await api.get("/PaymentMethod/dropdown");
  return res.data?.data || [];
};
