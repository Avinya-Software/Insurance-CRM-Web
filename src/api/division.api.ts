import api from "./axios";
import { DivisionResponse } from "../interfaces/division.interface";

export const getDivisionDropdownApi = async (id?: number | null) => {
  const params: any = {};
  if (id !== undefined && id !== null) {
    params.id = id;
  }
  const res = await api.get<DivisionResponse>("/Division/Get-Division", { params });
  return res.data;
};
