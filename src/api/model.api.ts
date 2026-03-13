import { ModelEntity } from "../interfaces/model.interface";
import api from "./axios";

export const getModelListApi = async (
    pageNumber: number,
    pageSize: number
  ) => {
  
    const res = await api.get<any>(
      `/Model?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  
    const apiData = res?.data?.data;
  
    return {
      totalCount: apiData?.totalCount || 0,
      data: apiData?.data || []
    };
  };

export const upsertModelApi = async (payload: ModelEntity) => {
  const res = await api.post("/Model", payload);
  return res.data;
};

export const deleteModelApi = async (id: string) => {
  const res = await api.delete(`/Model/${id}`);
  return res.data;
};