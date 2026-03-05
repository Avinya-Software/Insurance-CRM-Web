export interface AgencyPayload {
    id?: string;
  
    agencyName: string;
    agencyCode: string;
  
    agencyCompanyId?: string;
    agencyCompanyName?: string;
  
    mobileNumber?: string;
    email?: string;
  
    licenseStartDate?: string;
    licenseEndDate?: string;
  
    addressLine1?: string;
    addressLine2?: string;
  
    city?: string;
    state?: string;
  
    contactPerson?: string;
  
    type: number; // 0 = General , 1 = Life
  }
  
  export interface Agency {
    id: string;
  
    agencyName: string;
    agencyCode: string;
  
    agencyCompanyId?: string | null;
    agencyCompanyName?: string | null;
  
    mobileNumber?: string;
    email?: string;
  
    licenseStartDate?: string;
    licenseEndDate?: string;
  
    addressLine1?: string;
    addressLine2?: string;
  
    city?: string;
    state?: string;
  
    type: number;
  }
  
  export interface AgencyApiResponse {
    statusCode: number;
    statusMessage: string;
    data: Agency[];
  }