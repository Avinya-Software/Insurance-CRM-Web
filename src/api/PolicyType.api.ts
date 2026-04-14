import api from "./axios";
import { PolicyType, UpsertPolicyTypeRequest, UpdatePolicyTypeStatusRequest } from "../interfaces/PolicyType.interface";

export const getPolicyTypesApi = async (): Promise<PolicyType[]> => {
  const res = await api.get("/PolicyType");
  return res.data.data;
};

export const upsertPolicyTypeApi = async (data: UpsertPolicyTypeRequest) => {
  const res = await api.post("/PolicyType/upsert", data);
  return res.data;
};

export const updatePolicyTypeStatusApi = async (data: UpdatePolicyTypeStatusRequest) => {
  const res = await api.patch("/PolicyType/update-status", data);
  return res.data;
};

export const getPolicyTypeDropdownApi = async (divisionId: number, segmentId: number): Promise<{ id: string; name: string }[]> => {
  const res = await api.get(`/PolicyType/dropdown`, {
    params: { divisionId, segmentId },
  });
  return res.data.data.map((item: any) => ({
    id: item.id.toString(),
    name: item.policyTypeName,
  }));
};
