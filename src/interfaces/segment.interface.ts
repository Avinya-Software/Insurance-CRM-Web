export interface Segment {
  segmentId: number;
  segmentName: string;
  divisionId: number;
  divisionName: string;
  segmentType: string | number | null;
  segmentTypeName: string | null;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string | null;
}

export interface SegmentPayload {
  segmentId: number;
  segmentName: string;
  divisionId: number | string;
  segmentType: number | null;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface SegmentResponse {
  statusCode: number;
  statusMessage: string;
  data: Segment[];
}
