// src/api/leadFollowUp.api.ts
import { LeadFollowUp } from "../interfaces/leadFollowUp.interface";
import api from "./axios";

export interface CreateFollowUpRequest {
  leadId: string;
  followUpDate: string;
  nextFollowupDate: string | null;
  remark: string;
  status: number;
  followUpBy: string;
  notes: string;
}


export const createFollowUpApi = async (
  data: CreateFollowUpRequest
) => {
  const res = await api.post("/FollowUp/add", data);
  return res.data;
};


export const getFollowUpsByLeadId = async (leadId: string) => {
  const response = await api.get(
    `/lead-followups/by-lead/${leadId}`
  );
  return response.data;
};

export const getLeadFollowupStatusesApi  = async () => {
  const res = await api.get("/lead-followups/lead-followup-statuses");
  console.log(res.data);
  return res.data;
}
