import api from "./axios";

export const getBankFilterApi = async (params: { pageNumber: number, pageSize: number, search?: string }) => {
  const res = await api.get("/Bank/list", { params });
  return res.data;
};

export const getBankDropdownApi = async () => {
  const res = await api.get("/Bank/dropdown");
  return res.data?.data || [];
};

export const upsertBankApi = async (data: any) => {
  const res = await api.post("/Bank/add", data);
  return res.data;
};

export const updateBankStatusApi = async (data: { id: number; status: boolean }) => {
  const res = await api.put("/Bank/status", data);
  return res.data;
};
