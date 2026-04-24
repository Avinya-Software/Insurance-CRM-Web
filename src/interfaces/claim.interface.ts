export interface ClaimFilters {
  pageNumber: number;
  pageSize: number;
  search?: string;
  divisionType?: number;
  customerId?: string;
  claimStatus?: number;
  claimType?: number;
}

export interface Claim {
  claimId: string;
  claimNumber: string;
  customerId: string;
  customerName: string | null;
  policyId: string;
  policyNumber: string | null;
  memberId: string | null;
  memberName: string | null;
  divisionType: number;
  divisionTypeName: string;
  claimEventType: number;
  claimEventTypeName: string;
  claimType: number;
  claimTypeName: string;
  claimStatus: number;
  claimStatusName: string;
  claimDate: string;
  incidentDate: string;
  claimAmount: number;
  approvedAmount: number;
  description: string;
  createdDate: string;
  survey: {
    id: string;
    surveyorName: string;
    surveyorContact: string;
    surveyDate: string;
  } | null;
  motor: {
    id: string;
    vehicleNumber: string;
    garageName: string;
    garageAddress: string;
    accidentDescription: string;
    isFIRFiled: boolean;
  } | null;
  health: {
    id: string;
    hospitalName: string;
    hospitalAddress: string;
    illnessType: string;
  } | null;
  death: {
    id: string;
    dateOfDeath: string;
    causeOfDeath: string;
    placeOfDeath: string;
    deathType: number;
    deathTypeName: string;
  } | null;
  risk: {
    id: string;
    riskAddress: string;
    lossAmount: number;
    damageDescription: string;
  } | null;
}

export interface PaginatedClaims {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  data: Claim[];
}

export interface CreateClaimRequest {
  claimId?: string;

  policyId: string;
  customerId: string;

  claimStatusId: string;

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

export interface ClaimFile {
  fileName: string;
  url: string;
}
