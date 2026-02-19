import api from "./axios";

/*   CLAIM TYPE DROPDOWN   */
export const getClaimTypesApi = async () => {
  const res = await api.get("/claim/claim-types");
  return res.data.data;
};

/*   CLAIM STAGE DROPDOWN   */
export const getClaimStagesApi = async () => {
  const res = await api.get("/claim/claim-stages");
  return res.data.data;
};

/*   CLAIM HANDLER DROPDOWN   */
export const getClaimHandlersApi = async () => {
  const res = await api.get("/claim/claim-handlers");
  return res.data.data;
};
