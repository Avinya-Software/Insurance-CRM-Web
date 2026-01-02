// src/api/lead.api.ts
import api from "./axios";
export const getLeadsApi = async (filters) => {
    const res = await api.get("/Lead", {
        params: filters,
    });
    return res.data;
};
export const getLeadStatusesApi = async () => {
    const res = await api.get("/Lead/lead-statuses");
    return res.data;
};
export const getLeadSourcesApi = async () => {
    const res = await api.get("/Lead/lead-sources");
    return res.data;
};
export const upsertLeadApi = async (data) => {
    const res = await api.post("/Lead", data);
    return res.data;
};
