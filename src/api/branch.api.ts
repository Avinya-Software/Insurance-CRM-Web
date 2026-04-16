import api from "./axios";

export const getBranchDropdownApi = async () => {
  const res = await api.get("/Branch/dropdown");
  return res.data?.data || [];
};

export const upsertBranchApi = async (data: any) => {
  const res = await api.post("/Branch/add", data);
  return res.data;
};
