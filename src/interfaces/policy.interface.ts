// src/interfaces/policy.interface.ts

export interface UpsertPolicyPayload {
  policyId?: string | null;
  customerId: string;
  insurerId: string;
  productId: string;

  policyTypeId: number;
  policyStatusId: number;

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

  policyDocuments?: File[]; 
}

export interface Policy {
  policyId: string;

  policyNumber: string;

  customerId: string;
  customerName: string;

  insurerId: string;
  insurerName: string;

  productId: string;
  productName: string;

  policyTypeId: number;
  policyTypeName: string;

  policyStatusId: number;
  policyStatusName: string;

  startDate: string | null;
  endDate: string | null;

  premiumNet: number;
  premiumGross: number;
}
export interface PoliciesResponse {
  statusCode: number;
  statusMessage: string;
  data: {
    totalRecords: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: Policy[];
  };
}


export interface PolicyStatus {
  policyStatusId: number;
  statusName: string;
  isActive: boolean;
  createdAt: string;
}