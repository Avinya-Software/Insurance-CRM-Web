// src/api/lead.api.ts
import api from "./axios";
import type {
  LeadFilters,
  LeadListResponse,
} from "../interfaces/lead.interface";

/*   GET LEADS (PAGINATED)   */

export const getLeadsApi = async (filters: LeadFilters) => {
  const res = await api.get("/Lead", { params: filters });

  const apiData = res.data.data; 

  return {
    totalRecords: apiData.totalCount,
    pageNumber: apiData.page,
    pageSize: apiData.pageSize,
    totalPages: apiData.totalPages,
    data: apiData.data,
  };
};

/*   LEAD STATUSES   */

export const getLeadStatusesApi = async () => {
  const res = await api.get("/Lead/lead-statuses");

  return (res.data?.data ?? []).map((s: any) => ({
    id: s.leadStatusId,
    name: s.statusName,
  }));
};


/*   LEAD SOURCES   */

export const getLeadSourcesApi = async () => {
  const res = await api.get("/Lead/lead-sources");

  return (res.data?.data ?? []).map((s: any) => ({
    id: s.leadSourceId,
    name: s.sourceName,
  }));
};


/*   CREATE / UPDATE LEAD   */

export const upsertLeadApi = async (data: any) => {
  const res = await api.post("/Lead", data);
  return res.data;
};

/*   DELETE LEAD (BY ID)   */

export const deleteLeadApi = async (
  leadId: string
) => {
  const res = await api.delete(
    `/Lead/${leadId}`
  );
  return res.data;
};
export const updateLeadStatusApi = async (
  leadId: string,
  statusId: number,
  notes?: string
) => {
  const payload: any = {
    LeadId: leadId,
    LeadStatusId: statusId,
  };

  if (notes) payload.Notes = notes;

  const res = await api.post("/Lead", payload); 
  return res.data;
};

export const getLeadByIdApi = async (leadId: string) => {
  const res = await api.get(`/Lead/${leadId}`);
  return res.data.data;
};