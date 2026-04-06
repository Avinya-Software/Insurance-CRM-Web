export interface Renewal {
  renewalId: string;
  policyId: string;
  customerId: string;
  renewalNo: number;
  dueDate: string;
  paidDate: string | null;
  amount: number;
  nextDueDate: string;
  reminderDate: string;
  isRenewed: boolean;
  remark: string;
  renewalStatusId: number;
  renewalStatus: string;
  createdDate: string;
  title: string;
  clientName: string;
  groupHeadName: string;
  groupCode: string;
  clientCategory: string;
  email: string;
  primaryMobile: string;
  referenceName: string;
  policyNumber: string;
  companyName: string;
  premiumMode: string;
  policyTerm: number;
  ppt: number;
  policyStartDate: string;
  nextPremiumDueDate: string;
  sumAssured: number;
  installmentPremium: number;
  basicPremium: number;
  gstAmount: number;
  finalInstallmentPremium: number;
  annualPremium: number;
}

export interface RenewalApiResponse {
  statusCode: number;
  statusMessage: string;
  data: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: Renewal[];
  };
}

export interface GetRenewalsParams {
  pageNumber: number;
  pageSize: number;
  search?: string;
  renewalStatusId?: number;
  customerId?: string;
}

export interface UpdateRenewalStatusPayload {
  id: string;
  renewalStatusId: number;
}
