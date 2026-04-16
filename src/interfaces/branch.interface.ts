export interface Branch {
  id: number;
  name: string;
  isActive: boolean;
  createdDate?: string;
  modifiedDate?: string;
}

export interface BranchPayload {
  branchName: string;
}

export interface BranchResponse {
  statusCode: number;
  statusMessage: string;
  data: Branch[];
}
