import api from "./axios";
import type {
  HPADetail,
  UpsertHPADetailRequest,
} from "../interfaces/HPADetails.interface";

export const getHPADetailsApi = async (): Promise<HPADetail[]> => {
  const res = await api.get("/HPADetail/GetAll");
  return res.data.data;
};

export const upsertHPADetailApi = async (
  data: UpsertHPADetailRequest
) => {
  const res = await api.post("/HPADetail/CreateOrUpdate", data);
  return res.data;
};

export const deleteHPADetailApi = async (id: string) => {
  const res = await api.delete(`/HPADetail/Delete/${id}`);
  return res.data;
};