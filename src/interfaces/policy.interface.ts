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
  createdAt: string;
  policyDocuments?: {
    fileName: string;
    url: string;
  }[];
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

export interface PolicyByCustomerDropdownDto {
  policyId: string;
  policyNumber: string;
}

export interface InsuranceTypeDto {
  id: number;
  type: string;
}

export interface InsuranceTypeResponse {
  statusCode: number;
  statusMessage: string;
  data: InsuranceTypeDto[];
}


export interface CustomerDropdown {
  customerId: string;
  clientName: string;
  groupHeadName: string | null;
}

export interface AgencyDropdown {
  id: string;
  agencyName: string;
}

export interface UserDropdown {
  id: string;
  name: string;
}

export interface LifePolicyPremiumDetails {
  installmentPremium: number;
  premiumIncludingGST: number;
  basicPremium: number;
  gstPercentage: number;
  gstAmount: number;
  finalInstallmentPremium: number;
  annualPremium: number;
}

export interface CashflowDetail {
  id: string
  maturityDate: string
  noOfYears: number
  amountPerYear: number
  description: string
}

export interface FundDetail {
  id: string
  fmcName: string
  fmcPercentage: number
  fundDate: string
  unitBalance: number
}

export interface RiderDetail {
  id: string
  riderName: string
  commDate: string
  sumAssured: number
  term: number
  ppt: number
  yearlyPremium: number
}

export interface PolicyDocument {
  id: string
  fileName: string
  url: string
  uploadedAt: string
}

export interface LifePolicy {
  policyId: string
  customerId: string

  proposerName: string
  policyNumber: string

  policyStatusId: number
  policyStatusName: string

  statusId: number
  statusName: string

  baId: string
  baName: string

  agencyId: string
  agencyName: string

  companyId: string
  companyName: string

  productId: number
  productName: string

  dob: string
  age: number

  nomineeName: string
  nomineeType: string
  relationWithLA: string

  premiumMode: string
  policyTerm: number
  ppt: number

  policyStartDate: string
  completionDate: string
  nextPremiumDueDate: string
  graceDate: string
  maturityDate: string

  objectiveOfInsurance: string
  sumAssured: number

  createdAt: string

  premiumDetails?: any
  paymentDetails?: any

  cashflowDetails?: CashflowDetail[]
  fundDetails?: FundDetail[]
  riderDetails?: RiderDetail[]

  documents?: PolicyDocument[]
}

export interface LifePolicyPagedResponse {
  data: LifePolicy[]
  totalRecords: number
  page: number
  pageSize: number
  totalPages: number
}