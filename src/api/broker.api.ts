import api from "./axios";

export const getBrokerDropdownApi = async () => {
  const res = await api.get("/Broker/dropdown");
  return res.data?.data || [];
};

export const upsertBrokerApi = async (data: any) => {
  const res = await api.post("/Broker/add", data);
  return res.data;
};
