export interface Policy {
  policyId: string;
  customerId: string;
  insurerId: string;
  productId: string;

  policyTypeId: number;
  policyStatusId: number;

  policyNumber: string;
  registrationNo?: string;
  policyTypeName?:string;
  insurerName?:string;
  productName?:string;
  policyStatusName?:string;
  
  startDate: string;
  endDate: string;

  premiumNet: number;
  premiumGross: number;

  paymentMode?: string;
  paymentDueDate?: string;
  renewalDate?: string;

  policyDocumentRef?: string;
  brokerCode?: string;
  policyCode?: string;
}
