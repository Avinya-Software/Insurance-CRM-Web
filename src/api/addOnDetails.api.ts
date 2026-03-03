import api from "./axios";
import type {
    AddOnDetail,
  AddOnDetailResponse,
  UpsertAddOnDetailRequest,
} from "../interfaces/addondetails.interface";

export const getAddOnDetailsApi = async (): Promise<AddOnDetail[]> => {
    const res = await api.get("/AddOnDetail");
    return res.data.data;
  };


export const upsertAddOnDetailApi = async (
  data: UpsertAddOnDetailRequest
) => {
  const res = await api.post("/AddOnDetail", data);
  return res.data;
};


export const deleteAddOnDetailApi = async (id: string) => {
    const res = await api.delete(`/AddOnDetail/${id}`);
    return res.data;
  };