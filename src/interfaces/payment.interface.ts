export interface PaymentMethod {
  id: number;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface PaymentMethodPayload {
  id?: number;
  name: string;
}

export interface PaymentMethodPagedResponse {
  statusCode: number;
  statusMessage: string;
  data: {
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    data: PaymentMethod[];
  };
}
