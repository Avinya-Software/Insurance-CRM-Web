import { AgencyApiResponse, AgencyPayload } from "../interfaces/agency.interface";
import api from "./axios";

export const upsertAgency = async (data: AgencyPayload) => {
    const res = await api.post("/Agency", data);
    return res.data;
  };


export const getAgencyListApi  = async (type : number) => {
    const res = await api.get<AgencyApiResponse>(`/Agency/${type}`);
    return res.data.data;
}  

export const deleteAgencyApi = async (id : string) => {
    const res = await api.delete(`/Agency/${id}`);
    return res.data;
}