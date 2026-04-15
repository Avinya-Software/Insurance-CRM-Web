import api from "./axios";

export const getBankDropdownApi = async () => {
  const res = await api.get("/Bank/dropdown");
  return res.data?.data || [];
};
