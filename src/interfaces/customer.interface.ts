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
export interface CustomerDropdown {
  customerId: string;
  fullName: string;
  email: string;
  dob: string | null;
  anniversary: string | null;
}
export interface Customer {
  customerId: string;
  fullName: string;
  primaryMobile: string;
  secondaryMobile?: string;
  email: string;
  address: string;
  companyId?: string;
  companyName?: string;
  dob?: string | null;
  anniversary?: string | null;
  kycStatus?: string;
  createdAt: string;
  campaigns?: CustomerCampaign[];
}

export interface CustomerCampaign {
  CampaignCustomerId: string;
  CampaignId: string;
  Name: string;
  CampaignType: string;
  StartDate: string | null;
  EndDate: string | null;
}

export interface CustomerPagedResponse {
  data: any;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  customers: Customer[];
}

export interface CustomerDetailsProps {
  customerId: string;
  onClose: () => void;
}

export interface CustomerDetailsResponse {
  statusCode: number;
  statusMessage: string;
  data: CustomerDetails;
}

export interface CustomerDetails {
  customerId: string;
  fullName: string;
  primaryMobile: string;
  secondaryMobile?: string | null;
  email: string;
  address?: string | null;
  leadId?: string | null;
  companyId: string;
  advisorId: string;
  dob?: string | null;
  anniversary?: string | null;
  kycUploadedDate?: string | null;
  kycStatus?: string;
  kycFiles?: KycFile[];
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}


export interface KycFile {
  id: string;
  fileName: string;
  url: string;
  uploadedAt?: string;
}

