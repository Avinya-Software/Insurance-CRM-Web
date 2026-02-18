export interface CreateClaimRequest {
  claimId?: string;

  policyId: string;
  customerId: string;

  claimTypeId: string;
  claimStageId: string;
  claimHandlerId: string;

  incidentDate: string; // yyyy-MM-dd
  claimAmount: any;
  approvedAmount?: any;

  tatDays: number;
  status?: string;
  notes?: string;

  documents?: File[];
}

export interface ClaimResponse {
  claimId: string;
  status: string;
  documents?: string;
}

export interface ClaimFilters {
  page: number;
  pageSize: number;
  search?: string;
  customerId?: string;
  policyId?: string;
  status?: string;
  claimTypeId?: number;
}

export interface Claim {
  claimId: string;
  companyId: string | null;
  advisorId: string;
  policyId: string;
  policy: string; 
  customerId: string;
  customer: string; 
  customerEmail: string;
  claimTypeId: number;
  claimStageId: number;
  claimHandlerId: number;
  incidentDate: string;
  claimAmount: number;
  approvedAmount: number | null;
  claimFile: string | null;
  status: string;
  tatDays: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  claimType: string;
  claimStage: string;
  claimHandler: string;
}


export interface PaginatedClaims {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: Claim[];
}
