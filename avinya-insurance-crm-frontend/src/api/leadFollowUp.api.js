// src/api/leadFollowUp.api.ts
import api from "./axios";
export const createFollowUpApi = async (data) => {
    const res = await api.post("/lead-followups", data);
    return res.data;
};
export const getFollowUpsByLeadId = async (leadId) => {
    const response = await api.get(`/lead-followups/by-lead/${leadId}`);
    return response.data;
};
