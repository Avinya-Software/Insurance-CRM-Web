import api from "./axios";

export const getBankDropdownApi = async () => {
  const res = await api.get("/Bank/dropdown");
  return res.data?.data || [];
};

export const upsertBankApi = async (data: any) => {
  const res = await api.post("/Bank/add", data);
  return res.data;
};
