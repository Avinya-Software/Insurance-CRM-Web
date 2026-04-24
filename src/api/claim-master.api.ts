import api from "./axios";

/*   CLAIM STATUS DROPDOWN   */
export const getClaimStatusApi = async () => {
  const res = await api.get("/Claim/dropdown/claim-status");
  return res.data.data;
};

/*   CLAIM TYPE DROPDOWN   */
export const getClaimTypeApi = async () => {
  const res = await api.get("/Claim/claim-type");
  return res.data.data;
};

/*   CLAIM EVENT TYPE DROPDOWN   */
export const getClaimEventTypeApi = async () => {
  const res = await api.get("/Claim/claim-event-type");
  return res.data.data;
};

/*   DEATH TYPE DROPDOWN   */
export const getDeathTypeApi = async () => {
  const res = await api.get("/Claim/death-type");
  return res.data.data;
};
