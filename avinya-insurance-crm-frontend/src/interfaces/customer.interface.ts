export interface CreateCustomerRequest {
  customerId?: string;
  fullName: string;
  primaryMobile: string;
  secondaryMobile?: string;
  email: string;
  address?: string;
  leadId?: string;
  dob?: string;
  anniversary?: string;
  notes?: string;
  advisorId?: string;
  kycFiles?: File[];
}

export interface CustomerResponse {
  customerId: string;
  fullName: string;
  primaryMobile: string;
  email: string;
  address?: string;
  createdAt: string;
}
