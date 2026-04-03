import api from "./axios";
import { DivisionResponse } from "../interfaces/division.interface";

export const getDivisionDropdownApi = async (id: number = 0) => {
  const res = await api.get<DivisionResponse>("/Division/Get-Division", {
    params: { id }
  });
  return res.data;
};
