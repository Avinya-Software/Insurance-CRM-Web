import api from "./axios";

/*   UPSERT   */
export const upsertRenewalApi = async (payload: {
  renewalId?: string;
  policyId: string;
  customerId: string;
  renewalStatusId: number;
  renewalDate: string;
  renewalPremium: number;
  reminderDatesJson: string;
}) => {
  const res = await api.post("/renewals/upsert", payload);
  return res.data;
};

/*   LIST   */
export const getRenewalsApi = async (params: {
  pageNumber: number;
  pageSize: number;
  search?: string;
  renewalStatusId?: number;
  customerId?: string;
}) => {
  const res = await api.get("/renewals", { params });
  return res.data;
};

/*   STATUS DROPDOWN   */
export const getRenewalStatusesApi = async () => {
  const res = await api.get("/renewals/renewal-status-dropdown");
  return res.data?.data || [];
};

export const updateRenewalStatusApi = async (payload: {
  id: string;
  renewalStatusId: number;
}) => {
  const res = await api.put("/renewals/update-status", payload);
  return res.data;
};
