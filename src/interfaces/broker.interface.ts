export interface Broker {
  id: number;
  name: string;
  isActive: boolean;
  createdDate?: string;
  modifiedDate?: string;
}

export interface BrokerPayload {
  name: string;
}

export interface BrokerResponse {
  statusCode: number;
  statusMessage: string;
  data: Broker[];
}
