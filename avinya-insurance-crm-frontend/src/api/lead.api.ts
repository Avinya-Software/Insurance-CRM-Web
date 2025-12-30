// src/api/lead.api.ts
import api from "./axios";
import type { LeadFilters, LeadListResponse } from "../interfaces/lead.interface";

export const getLeadsApi = async (filters: LeadFilters) => {
  const res = await api.get<LeadListResponse>("/Lead", {
    params: filters,
  });
  return res.data;
};
export const getLeadStatusesApi = async () => {
  const res = await api.get<{ id: number; name: string }[]>(
    "/Lead/lead-statuses"
  );
  return res.data;
};

export const getLeadSourcesApi = async () => {
  const res = await api.get<{ id: number; name: string }[]>(
    "/Lead/lead-sources"
  );
  return res.data;
};
export const upsertLeadApi = async (data: any) => {
  const res = await api.post("/Lead", data);
  return res.data;
};