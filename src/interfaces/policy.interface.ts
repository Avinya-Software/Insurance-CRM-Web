// src/interfaces/policy.interface.ts

export interface Policy {
  policyId: string;
  customerId?: string;
  customerName?: string;
  insurerId?: string;
  productId?: string;

  policyTypeId?: number;
  policyStatusId?: number;

  policyNumber: string;
  registrationNo?: string;
  policyTypeName?: string;
  insurerName?: string;
  productName?: string;
  policyStatusName?: string;
  paymentDone: boolean;

  startDate: string;
  endDate: string;

  premiumNet: number;
  premiumGross: number;

  paymentMode?: string;
  paymentDueDate?: string;
  renewalDate?: string;

  policyDocumentRef?: string;
  brokerCode?: string;
  policyCode?: string;
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
