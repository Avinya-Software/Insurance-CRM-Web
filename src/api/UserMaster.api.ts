import { 
    UserMasterApiResponse, 
    UserTypeApiResponse, 
    UserPayload 
  } from "../interfaces/UserMaster.interface";
  import api from "./axios";
  
  export const getUserMasterListApi = async (
    userTypeId: string | null,
    pageNumber: number,
    pageSize: number
  ): Promise<UserMasterApiResponse> => {
    const url = userTypeId 
      ? `/UserMaster?userTypeId=${userTypeId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
      : `/UserMaster?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      
    const res = await api.get<UserMasterApiResponse>(url);
    return res.data;
  };
  
  export const getUserTypesApi = async (): Promise<UserTypeApiResponse> => {
    const res = await api.get<UserTypeApiResponse>("/UserMaster/GetUserType");
    return res.data;
  };
  
  export const upsertUserApi = async (data: UserPayload) => {
    const endpoint = data.id ? `/UserMaster` : `/auth/register-UserMaster`;
    const res = await api.post(endpoint, data);
    return res.data;
  };
  
  export const deleteUserApi = async (id: string) => {
    const res = await api.delete(`/UserMaster/${id}`);
    return res.data;
  };
  