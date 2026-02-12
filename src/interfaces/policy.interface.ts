// src/interfaces/policy.interface.ts

export interface UpsertPolicyPayload {
  policyId?: string | null;
  customerId: string;
  insurerId: string;
  productId: string;

  policyTypeId: number;
  policyStatusId: number;

  policyNumber: string;
  registrationNo?: string;

  startDate: string | null;
  endDate: string | null;

  premiumNet: number;
  premiumGross: number;

  paymentMode?: string;
  paymentDueDate?: string | null;
  renewalDate?: string | null;

  brokerCode?: string;
  policyCode?: string;
  paymentDone: boolean;
// ✅ base64 files
policyDocuments: string[];
}


export interface PoliciesResponse {
  statusCode: number;
  statusMessage: string;
  data: {
    totalRecords: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: UpsertPolicyPayload[];
  };
}


export interface PolicyStatus {
  policyStatusId: number;
  statusName: string;
  isActive: boolean;
  createdAt: string;
}