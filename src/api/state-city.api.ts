import api from "./axios";

/* ── TYPES ── */
export interface State {
  stateID: number;
  stateName: string;
}

export interface City {
  cityID: number;
  stateID: number;
  cityName: string;
}

interface ApiResponse<T> {
  statusCode: number;
  statusMessage: string;
  data: T;
}

/* ── API CALLS ── */
export const getStatesApi = async (): Promise<State[]> => {
  const res = await api.get<ApiResponse<State[]>>("/State");
  return res.data.data;
};

export const getCitiesByStateApi = async (stateId: number): Promise<City[]> => {
  const res = await api.get<ApiResponse<City[]>>(`/City/${stateId}`);
  return res.data.data;
};