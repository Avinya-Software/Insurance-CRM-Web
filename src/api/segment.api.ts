import api from "./axios";
import { SegmentResponse } from "../interfaces/segment.interface";

export const getSegmentsApi = async (params: {
  pageNumber: number;
  pageSize: number;
  getAll: boolean;
  search?: string;
}) => {
  const res = await api.get<any>("/Segment/Get-SegmentList", {
    params,
  });
  return res.data;
};

export const getSegmentListApi = async (divisionid?: number) => {
  const params: any = {}; // no getall parameter
  if (divisionid !== undefined && divisionid !== null) {
    params.divisionid = divisionid;
  }
  const res = await api.get<any>("/Segment/Get-SegmentList", {
    params
  });

  // Defensive unwrapping
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  if (Array.isArray(res.data?.data?.data)) return res.data.data.data;
  return [];
};

export const upsertSegmentApi = async (data: any) => {
  const res = await api.post("/Segment/CreateUpdate-Segment", data);
  return res.data;
};
export const updateSegmentStatusApi = async (data: { segmentId: number; isActive: boolean }) => {
  const res = await api.patch("/Segment/Update-Segment-Isactive", data);
  return res.data;
};
