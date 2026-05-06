import api from "./axios";

export const getBranchFilterApi = async (params: { pageNumber: number, pageSize: number, search?: string }) => {
  const res = await api.get("/Branch/filter", { params });
  return res.data;
};

export const getBranchDropdownApi = async () => {
  const res = await api.get("/Branch/dropdown");
  return res.data?.data || [];
};

export const upsertBranchApi = async (data: any) => {
  const res = await api.post("/Branch/add", data);
  return res.data;
};

export const updateBranchStatusApi = async (data: { id: number; status: boolean }) => {
  const res = await api.put("/Branch/status", data);
  return res.data;
};
