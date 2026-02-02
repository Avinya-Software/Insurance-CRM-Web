export interface CreateLeadRequest {
  leadId?: string;
  fullName: string;
  email?: string;
  mobile?: string;
  address?: string;
  leadStatusId: number;
  leadSourceId: number;
  leadSourceDescription?: string;
  advisorId: string;
  notes?: string;
  customerId?: string;
}

export interface LeadResponse {
  leadId: string;
  leadNo: string;
  fullName: string;
  email?: string;
  mobile?: string;
  createdAt: string;
}
// src/interfaces/lead.interface.ts

export interface Lead {
  leadId: string;
  leadNo: string;
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  leadStatusId: number;
  leadStatusName: string;
  leadSourceId: number;
  leadSourceName: string;
  leadSourceDescription: string;
  companyId: string | null;
  advisorId: string;
  isConverted: boolean;
  customerId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  followUps: FollowUp[];
}

export interface LeadFilters {
  pageNumber: number;
  pageSize: number;
  search?: string;
  fullName?: string;
  email?: string;
  mobile?: string;
  leadStatusId?: number;
  leadSourceId?: number;
}

export interface LeadListResponse {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  data: Lead[];
}

export interface FollowUp {
  followUpId: string;
  nextFollowUpDate: string;
  createdAt: string;
}
