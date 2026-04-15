import api from "./axios";

export const getBranchDropdownApi = async () => {
  const res = await api.get("/Branch/dropdown");
  return res.data?.data || [];
};
