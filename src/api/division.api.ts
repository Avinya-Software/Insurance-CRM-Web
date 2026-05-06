import api from "./axios";
import { DivisionResponse } from "../interfaces/division.interface";

export const getDivisionDropdownApi = async (id?: number | null) => {
  const params = id != null ? { id } : undefined;

  const res = await api.get<DivisionResponse>("/Division/Get-Division", {
    params,
  });

  return res.data;
};