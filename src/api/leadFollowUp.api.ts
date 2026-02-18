// src/api/leadFollowUp.api.ts
import { LeadFollowUp } from "../interfaces/leadFollowUp.interface";
import api from "./axios";

export interface CreateFollowUpRequest {
  leadId: string;
  status: number;
  nextFollowUpDate: string | null;
  remark: string;
  followUpId?: string;
}

export const createFollowUpApi = async (
  data: CreateFollowUpRequest
) => {
  const res = await api.post("/lead-followups", data);
  return res.data;
};
export const getFollowUpsByLeadId = async (
  leadId: string
): Promise<LeadFollowUp[]> => {
  const response = await api.get(`/lead-followups/lead/${leadId}`);
  console.log(response.data);
  return response.data.data; 
};

export const getLeadFollowupStatusesApi  = async () => {
  const res = await api.get("/lead-followups/lead-followup-statuses");
  console.log(res.data);
  return res.data;
}
