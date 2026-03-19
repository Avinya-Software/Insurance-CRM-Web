export interface Product {
  productId: number;
  productName: string;
  companyId: string;
  companyName?: string;
  insuranceTypeId: number;
  insuranceType: string | null;
  policyType: boolean;
}