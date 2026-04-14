export interface PolicyType {
  id: number;
  division: number;
  divisionName: string;
  segment: string;
  segmentName: string;
  policyTypeName: string;
  status: boolean;
  createdDate: string;
}

export interface UpsertPolicyTypeRequest {
  id: number;
  division: number;
  segmentIds: number[];
  policyTypeName: string;
}

export interface UpdatePolicyTypeStatusRequest {
  id: number;
  status: boolean;
}
