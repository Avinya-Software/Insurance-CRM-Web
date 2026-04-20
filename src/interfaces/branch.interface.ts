export interface Branch {
  id: number;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface BranchPayload {
  id?: number;
  branchName: string;
}

export interface BranchListResponse {
  statusCode: number;
  statusMessage: string;
  data: {
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    data: Branch[];
  };
}
