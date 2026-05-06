export interface Product {
  id: number;
  productId?: number; // For backward compatibility
  productName: string;
  companyId: string;
  companyName?: string;
  insurance?: number;
  insuranceName?: string | null;
  insuranceTypeId?: number;
  insuranceType?: string | null;
  divisionId?: number;
  divisionName?: string | null;
  segmentId?: number;
  segmentName?: string | null;
  createdDate?: string;
  status?: boolean;
  policyType: boolean;
}