import api from "./axios";
import { RenewalHistoryApiResponse } from "../interfaces/renewal-history.interface";

export const getRenewalHistoryApi = async (policyId: string): Promise<RenewalHistoryApiResponse> => {
  const res = await api.get(`/renewals/history/${policyId}`);
  return res.data;
};
