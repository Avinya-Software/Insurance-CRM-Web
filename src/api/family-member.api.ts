import api from "./axios";
import { FamilyMemberFilterParams, FamilyMemberResponse, FamilyMemberDropdownResponse } from "../interfaces/family-member.interface";

export const getFamilyMembersApi = async (params: FamilyMemberFilterParams): Promise<FamilyMemberResponse["data"]> => {
  const res = await api.get<FamilyMemberResponse>("/FamilyMember/filter", { params });
  return res.data.data;
};

export const getFamilyMemberDropdownApi = async () => {
  const res = await api.get<FamilyMemberDropdownResponse>("/FamilyMember/Dropdown");
  return res.data;
};
export const addFamilyMemberApi = async (data: FormData) => {
  const res = await api.post("/FamilyMember/Add-Member", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
