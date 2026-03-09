export interface UserType {
    id: string;
    name: string;
  }
  
  export interface UserDetail {
    srNo: number;
    id: string;
    userTypeId: string;
    userType: string;
    name: string;
    email: string;
    mobile: string;
    gstNumber: string;
    panNo: string;
    city: string;
    userName: string;
    password?: string;
    status: boolean;
    createdDate: string;
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
    mobile: string;
    gstNumber: string;
    panNo: string;
    city: string;
    userName: string;
    password?: string;
    status: boolean;
  }
  