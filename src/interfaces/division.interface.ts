export interface Division {
  divisionId: number;
  divisionName: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string | null;
}

export interface DivisionResponse {
  statusCode: number;
  statusMessage: string;
  data: Division[];
}
