// src/api/leadFollowUp.api.ts
import api from "./axios";

export interface CreateFollowUpRequest {
  leadId: string;
  followUpDate: string;
  nextFollowUpDate: string;
  remark: string;
}

export const createFollowUpApi = async (
  data: CreateFollowUpRequest
) => {
  const res = await api.post("/lead-followups", data);
  return res.data;
};
export const getFollowUpsByLeadId = async (leadId: string) => {
  const response = await api.get(
    `/api/lead-followups/by-lead/${leadId}`
  );
  return response.data;
};
