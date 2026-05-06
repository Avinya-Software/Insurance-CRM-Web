export interface Broker {
  id: number;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface BrokerPayload {
  id?: number;
  name: string;
}

export interface BrokerPagedResponse {
  statusCode: number;
  statusMessage: string;
  data: {
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    data: Broker[];
  };
}

