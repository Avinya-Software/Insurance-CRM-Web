import api from "./axios";
import { FamilyMemberFilterParams, FamilyMemberResponse, FamilyMemberDropdownResponse, StatusUpdateRequest } from "../interfaces/family-member.interface";

export const getFamilyMembersApi = async (params: FamilyMemberFilterParams): Promise<FamilyMemberResponse["data"]> => {
  const res = await api.get<FamilyMemberResponse>("/FamilyMember/filter", { params });
  return res.data.data;
};

export const getFamilyMemberDropdownApi = async (customerId?: string) => {
  const res = await api.get<FamilyMemberDropdownResponse>("/FamilyMember/Dropdown", {
    params: { customerId }
  });
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

export const updateFamilyMemberApi = async (data: FormData) => {
  const res = await api.put("/FamilyMember/Update", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateFamilyMemberStatusApi = async (data: StatusUpdateRequest) => {
  const res = await api.put("/FamilyMember/update-status", data);
  return res.data;
};

export const deleteFamilyMemberApi = async (id: string) => {
  const res = await api.delete(`/FamilyMember/soft-delete/${id}`);
  return res.data;
};

export const deleteFamilyMemberDocumentApi = async (familyMemberId: string, documentId: string) => {
  const res = await api.delete(`/FamilyMember/${familyMemberId}/documents/${documentId}`);
  return res.data;
};
