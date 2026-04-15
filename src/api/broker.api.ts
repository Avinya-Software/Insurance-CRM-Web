import api from "./axios";

export const getBrokerDropdownApi = async () => {
  const res = await api.get("/Broker/dropdown");
  return res.data?.data || [];
};
