// src/api/insurer.api.ts
import api from "./axios";
export const getInsurersApi = async (pageNumber, pageSize, search) => {
    const res = await api.get("/Insurer", {
        params: { pageNumber, pageSize, search },
    });
    return res.data;
};
export const upsertInsurerApi = async (data) => {
    const res = await api.post("/Insurer", data);
    return res.data;
};
export const getInsurerPortalPasswordApi = async (insurerId) => {
    const res = await api.get(`/Insurer/${insurerId}/portal-password`);
    return res.data;
};
export const getInsurerDropdownApi = async () => {
    const res = await api.get("/Insurer/dropdown");
    return res.data;
};
