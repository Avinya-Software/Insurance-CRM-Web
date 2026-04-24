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
