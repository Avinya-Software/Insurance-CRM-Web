export interface AddOnDetail {
    id?: string;
    insuranceTypeId: number;
    name: string;
    insuranceTypeName: string;
  }
  
  export interface AddOnDetailResponse {
    statusCode: number;
    statusMessage: string;
    data: AddOnDetail[];
  }
  
  export interface UpsertAddOnDetailRequest {
    id?: string;
    insuranceTypeId: number;
    name: string;
  }
  