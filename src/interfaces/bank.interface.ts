export interface BankPayload {
  name: string;
}

export interface BankResponse {
  id: string | number;
  name: string;
  status?: boolean;
}
