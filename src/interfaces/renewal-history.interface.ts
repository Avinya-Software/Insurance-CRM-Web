export interface RenewalHistoryRecord {
  renewalId: string;
  policyId: string;
  customerId: string;
  type: string;
  renewalNo: string;
  nextDueDate: string;
  reminderDate: string;
  isRenewed: boolean;
  remark: string | null;
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
  policyNumber: string;
  companyName: string;
  divisionType: number;
  divisionName: string;
  policyStartDate: string;
  nextPremiumDueDate: string;
  sumAssured: number;
  installmentPremium: number;
  basicPremium: number;
  gstAmount: number;
  finalInstallmentPremium: number;
  annualPremium: number;
}

export interface RenewalHistoryApiResponse {
  statusCode: number;
  statusMessage: string;
  data: RenewalHistoryRecord[];
}
