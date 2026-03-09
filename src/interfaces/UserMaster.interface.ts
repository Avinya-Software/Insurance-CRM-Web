export interface UserType {
    id: string;
    name: string;
  }
  
  export interface UserDetail {
    srNo: number;
    id: string;
    userTypeId: string;
    userType: string;
    aspNetUserId?: string | null;
    name: string;
    email: string;
    mobile: string;
    gstNumber: string;
    panNo: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    pincode: string;
    state: string;
    country: string;
    userCode: string;
    userName: string;
    officeNumber: string;
    residenceNumber: string;
    bankName: string;
    branchName: string;
    accountType: string;
    accountNumber: string;
    micrCode: string;
    ifscCode: string;
    password?: string;
    status: boolean;
    createdDate: string; // ISO string
  }
  
  export interface UserMasterData {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: UserDetail[];
  }
  
  export interface UserMasterApiResponse {
    statusCode: number;
    statusMessage: string;
    data: UserMasterData;
  }
  
  export interface UserTypeApiResponse {
    statusCode: number;
    statusMessage: string;
    data: UserType[];
  }
  
  export interface UserPayload {
    id?: string;
    userTypeId: string;
    name: string;
    email: string;
    mobileNumber: string;
    password?: string;
    gstNumber: string;
    panCard: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    pincode: string;
    state: string;
    country: string;
    userCode: string;
    userName: string;
    officeNumber: string;
    residenceNumber: string;
    bankName: string;
    branchName: string;
    accountType: string;
    accountNumber: string;
    micrCode: string;
    ifscCode: string;
    status?: boolean;
  }