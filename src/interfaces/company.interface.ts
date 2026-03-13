export interface Company {
    companyId?: string;
    companyName: string;
    email: string;
    mobileNumber: string;
    policyType: boolean; // false = General, true = Life
    type?: string; // "General" or "Life"
  }
  
  export interface CompaniesApiResponse {
    statusCode: number;
    statusMessage: string;
    data: {
      totalRecords: number;
      page: number;
      pageSize: number;
      totalPages: number;
      data: Company[];
    };
  }