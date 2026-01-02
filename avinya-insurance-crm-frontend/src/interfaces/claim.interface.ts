export interface CreateClaimRequest {
  claimId?: string;

  policyId: string;
  customerId: string;

  claimTypeId: number;
  claimStageId: number;
  claimHandlerId: number;

  incidentDate: string; // yyyy-MM-dd
  claimAmount: number;
  approvedAmount?: number;

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
  pageNumber: number;
  pageSize: number;
  search?: string;
  customerId?: string;
  policyId?: string;
  status?: string;
  claimTypeId?: number;
}
