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
  policy: string | null;
  policyStatus: string | null;
  insurers: string | null;
  product: string | null;
  customerId: string;
  customer: string | null;
  customerEmail: string | null;

  claimTypeId: number;
  claimStageId: number;
  claimHandlerId: number;

  incidentDate: string;
  claimAmount: number;
  approvedAmount: number | null;

  claimFile: string | null;
  claimFiles: ClaimFile[] | null;   

  status: string;
  tatDays: number;
  notes: string | null;

  createdAt: string;
  updatedAt: string | null;

  claimType: string | null;
  claimStage: string | null;
  claimHandler: string | null;
}

export interface ClaimFile {
  fileName: string;
  url: string;
}

export interface PaginatedClaims {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: Claim[];
}
