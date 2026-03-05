import api from "./axios";
import { Make } from "../interfaces/make.interface";

export const getMakeListApi = async (
  pageNumber: number,
  pageSize: number
) => {

  const res = await api.get<any>(
    `/Make?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );

  const apiData = res?.data?.data;

  return {
    totalCount: apiData?.totalCount || 0,
    data: apiData?.data || []
  };
};

export const upsertMakeApi = async (payload: Make) => {
  const res = await api.post("/Make", payload);
  return res.data;
};

export const deleteMakeApi = async (id: string) => {
  const res = await api.delete(`/Make/${id}`);
  return res.data;
};