export interface Bank {
  id: number;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface BankPayload {
  id?: number;
  name: string;
}

export interface BankListResponse {
  statusCode: number;
  statusMessage: string;
  data: {
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    data: Bank[];
  };
}
