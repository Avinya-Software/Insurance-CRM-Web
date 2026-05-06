export interface RenewalHistoryRecord {
  renewalId: string;
  policyId: string;
  customerId: string;
  type: string;
  renewalNo: string | null;
  nextDueDate: string | null;
  reminderDate: string | null;
  isRenewed: boolean;
  remark: string | null;
  renewalStatusId: number;
  renewalStatus: string;
  createdDate: string;
  title: string | null;
  clientName: string;
  groupHeadName: string | null;
  groupCode: string;
  clientCategory: string | null;
  email: string | null;
  primaryMobile: string | null;
  policyNumber: string;
  previousPolicyNumber: string;
  companyName: string | null;
  divisionType: number;
  divisionName: string | null;
  policyStartDate: string;
  policyEndDate: string | null;
  nextPremiumDueDate: string | null;
  sumAssured: number | null;
  memberCount: number | null;
  installmentPremium: number | null;
  basicPremium: number | null;
  gstAmount: number | null;
  finalInstallmentPremium: number | null;
  annualPremium: number | null;
}

export interface RenewalHistoryApiResponse {
  statusCode: number;
  statusMessage: string;
  data: RenewalHistoryRecord[];
}
