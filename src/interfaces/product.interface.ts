export interface Product {
  productId: string;
  insurerId: string;
  insurerName?: string;
  productCategoryId: number;
  productCategory?: string;
  productName: string;
  productCode: string;
  defaultReminderDays: number;
  commissionRules: string;
  isActive: boolean;
}

export interface ProductDropdown {
  productId: string;
  productName: string;
}

export interface ProductDropdownResponse {
  statusCode: number;
  statusMessage: string;
  data: ProductDropdown[];
}