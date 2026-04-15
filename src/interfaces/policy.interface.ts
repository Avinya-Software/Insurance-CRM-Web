// src/interfaces/policy.interface.ts

export interface IGeneralPolicyMember {
  memberId: string | null;
  memberName: string;
}

export interface IRiskLocation {
  srNo: number;
  sumAssured: number;
  riskAddress: string;
}

export interface IVehicleDetail {
  vehicleNumber: string;
  vehicleName: string;
  engineNo: string;
  chassisNo: string;
  brand: string;
  fuelType: string;
  registerDate: string;
  manufactureYear: string | number;
  rto: string;
  cc: string;
  gvw: string;
  ncb: string;
  fitnessCertificate: boolean;
  bhSeries: boolean;
}

export interface IPremiumDetail {
  sumAssured?: number;
  idvValue?: number;
  basicPremium: number;
  tpaPremium?: number;
  taxAmount: number;
  totalPremium: number;
  isCommission: boolean;
  commissionableAmount: number;
  commissionEntry: number;
  commitmentAmount: number;
}

export interface IPaymentDetail {
  paidByClient: string;
  clientAmount: number;
  paidByAgent: string;
  agentAmount: number;
}

export interface IPolicyDetail {
  divisionType: string;
  segmentId: string;
  policyType: string;
  insuranceCompanyId: string;
  branchId: string;
  productId: string;
  zone: string;
  optionalCover: string[];
  addOns: string[];
  isPolicyReceived: boolean;
  currentPolicyNumber: string;
  previousPolicyNumber: string;
  policyModeId: string;
  riskStartDate: string;
  riskEndDate: string;
  brokerId: string;
  agencyId: string;
  subAgentId: string;
  nomineeName: string;
  nomineeContact: string;
  remarks: string;
  vehicleUse?: string;
  vehicleClass?: string;
  tpPolicyMode?: string;
  tpDueDate?: string;
  bankId?: string;
}

export interface IGeneralPolicyForm {
  type: string;
  transactionDate: string;
  documentNumber: string;
  familyGroupId: string;
  policyHolderId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  area: string;
  mobileNumber: string;
  gender: string;
  email: string;
  dob: string;
  relationWithHead: string;
  detail: IPolicyDetail;
  members: IGeneralPolicyMember[];
  riskLocations: IRiskLocation[];
  vehicle: IVehicleDetail | null;
  premium: IPremiumDetail;
  payment: IPaymentDetail;
  files?: File[];
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
  sumAssured: string

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


export interface PremiumDetails {
  installmentPremium: number;
  premiumIncludingGST: boolean;
  basicPremium: number;
  gstPercentage: number;
  gstAmount: number;
  finalInstallmentPremium: number;
  annualPremium: number;
}

export interface PaymentDetails {
  ecs: string;
  paymentBy: string;
  paymentRefNo: string;
  paymentDate?: string;
  mandateExpDate?: string;
  accountNo: string;
  bankName: string;
  branchName: string;
  remarks: string;
}

export interface Cashflow {
  id?: string;
  maturityDate?: string;
  noOfYears: number;
  amountPerYear: number;
  description: string;
}

export interface Rider {
  id?: string;
  riderName: string;
  commDate?: string;
  sumAssured: number;
  term: number;
  ppt: number;
  yearlyPremium: number;
}

export interface Fund {
  id?: string;
  fmcName: string;
  fmcPercentage: number;
  fundDate?: string;
  unitBalance: number;
}

export interface UpsertLifePolicyPayload {
  policyId?: string;

  customerId: string;
  policyStatusId?: number;
  statusId?: number;

  dob?: string;
  age?: number;

  proposerName?: string;
  nomineeName?: string;
  nomineeType?: string;
  relationWithLA?: string;

  policyNumber: string;

  baId?: string;
  agencyId?: string;
  companyId?: string;
  productId?: number;

  premiumMode?: string;
  policyTerm?: number;
  ppt?: number;

  policyStartDate?: string;
  completionDate?: string;
  nextPremiumDueDate?: string;
  graceDate?: string;
  maturityDate?: string;

  objectiveOfInsurance?: string;
  sumAssured?: number;

  premium: PremiumDetails;
  payment: PaymentDetails;

  cashflows: Cashflow[];
  riders: Rider[];
  funds: Fund[];
}

export interface IGeneralPolicy {
  policyId: string;
  type: string;
  transactionDate: string;
  documentNumber: string;
  familyGroupId: string;
  familyGroupName: string;
  policyHolderId: string;
  policyHolderName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  mobileNumber: string;
  gender: string;
  email: string;
  dob: string;
  relationWithHead: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  area: string;
  divisionType: string | number;
  createdat: string
  detail: {
    id: string;
    policyId: string;
    divisionType: string | number;
    divisionTypeName: string;
    vehicleUse: string;
    vehicleClass: string;
    segmentId: string | number;
    segmentName: string;
    policyType: string | number;
    policyTypeName: string;
    insuranceCompanyId: string;
    insuranceCompanyName: string;
    branchId: string;
    branchName: string;
    productId: string;
    productName: string;
    zone: string;
    optionalCover: string;
    addOns: string;
    isPolicyReceived: boolean;
    currentPolicyNumber: string;
    previousPolicyNumber: string;
    policyModeId: string;
    policyModeName: string;
    riskStartDate: string;
    riskEndDate: string;
    bankId: string | null;
    bankName: string;
    brokerId: string;
    brokerName: string;
    agencyId: string;
    agencyName: string;
    subAgentId: string;
    subAgentName: string;
    nomineeName: string;
    nomineeContact: string;
    remarks: string;
  };
  members: {
    id: string;
    memberId: string;
    memberName: string;
    isDeleted: boolean;
  }[];
  riskLocations: any[];
  vehicle: {
    id: string;
    policyId: string;
    vehicleNumber: string;
    vehicleName: string;
    engineNo: string;
    chassisNo: string;
    brand: string;
    fuelType: string;
    registerDate: string | null;
    manufactureYear: number;
    rto: string;
    cc: string;
    gvw: string;
    ncb: string;
    fitnessCertificate: boolean;
    bhSeries: boolean;
  };
  premium: {
    id: string;
    policyId: string;
    idvValue: number;
    basicPremium: number;
    tpaPremium: number;
    tpPolicyMode: string;
    tpDueDate: string | null;
    isCommission: boolean;
    taxAmount: number;
    totalPremium: number;
    commissionableAmount: number;
    commissionEntry: number;
    commitmentAmount: number;
    sumAssured: number;
  };
  payment: {
    id: string;
    policyId: string;
    paidByClient: string;
    clientAmount: number;
    paidByAgent: string;
    agentAmount: number;
  };
}

export interface GeneralPolicyResponse {
  statusCode: number;
  statusMessage: string;
  data: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: IGeneralPolicy[];
  };
}

export interface GeneralPolicyFilters {
  search?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}
