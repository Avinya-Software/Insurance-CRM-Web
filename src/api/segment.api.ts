import api from "./axios";
import { SegmentResponse } from "../interfaces/segment.interface";

export const getSegmentListApi = async (divisionid?: number) => {
  const params: any = {};
  if (divisionid !== undefined && divisionid !== null) {
    params.divisionid = divisionid;
  }
  const res = await api.get<SegmentResponse>("/Segment/Get-SegmentList", {
    params
  });
  return res.data;
};

export const upsertSegmentApi = async (data: any) => {
  const res = await api.post("/Segment/CreateUpdate-Segment", data);
  return res.data;
};
