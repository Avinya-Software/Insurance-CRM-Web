import { AgencyApiResponse, AgencyPayload, PaginationAgencyResponse } from "../interfaces/agency.interface";
import api from "./axios";

export const upsertAgency = async (data: AgencyPayload) => {
    const res = await api.post("/Agency", data);
    return res.data;
  };


  export const getAgencyListApi = async (
    type: number,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginationAgencyResponse> => {
    const res = await api.get<AgencyApiResponse>(
      `/Agency/${type}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  
    return res.data.data;
  };

export const deleteAgencyApi = async (id : string) => {
    const res = await api.delete(`/Agency/${id}`);
    return res.data;
}