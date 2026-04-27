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
  policyType: number;
  policyTypeName: string | null;
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
  documents?: {
    id: string;
    fileName: string;
    documentName: string;
    url: string;
    uploadedAt?: string;
  }[] | null;
}

export interface PaginatedClaims {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  data: Claim[];
}

export interface Survey {
  id?: string;
  surveyorName: string;
  surveyorContact: string;
  surveyDate: string;
  remarks: string;
}

export interface MotorDetail {
  id?: string;
  vehicleNumber: string;
  garageName: string;
  garageAddress: string;
  accidentDescription: string;
  isFIRFiled: boolean;
  survey?: Survey;
}

export interface HealthDetail {
  id?: string;
  hospitalName: string;
  hospitalAddress: string;
  admissionDate: string;
  dischargeDate: string;
  illnessType: string;
  remarks: string;
}

export interface RiskDetail {
  id?: string;
  riskAddress: string;
  lossAmount: number;
  damageDescription: string;
  survey?: Survey;
}

export interface DeathDetail {
  id?: string;
  dateOfDeath: string;
  deathType: number;
  causeOfDeath: string;
  placeOfDeath: string;
  isPoliceCase: boolean;
  remarks: string;
}

export interface CreateClaimRequest {
  id?: string;
  policyId: string;
  customerId: string;
  memberId: string;
  divisionType: number;
  claimNumber: string;
  claimDate: string;
  incidentDate: string;
  claimEventType: number;
  claimType: number;
  claimStatus: number;
  claimAmount: number;
  approvedAmount: number;
  description: string;

  motorDetail?: MotorDetail;
  healthDetail?: HealthDetail;
  riskDetail?: RiskDetail;
  deathDetail?: DeathDetail;
  
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
