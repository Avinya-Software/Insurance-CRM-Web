export interface Segment {
  segmentId: number;
  segmentName: string;
  divisionId: number;
  divisionName: string;
  segmentType: string | null;
  segmentTypeName: string | null;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string | null;
}

export interface SegmentResponse {
  statusCode: number;
  statusMessage: string;
  data: Segment[];
}
