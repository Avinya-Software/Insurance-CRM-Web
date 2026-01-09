import api from "./axios";
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  ApiWrapper
} from "../interfaces/admin.interface";

// ================= LOGIN =================
export const loginAdminApi = async (
  data: AdminLoginRequest
) => {
  const res = await api.post<ApiWrapper<AdminLoginResponse>>(
    "/admin/login",
    data
  );
  return res.data;
};

// ================= PENDING ADVISORS =================
export const getPendingAdvisorsApi = async () => {
  const res = await api.get<ApiWrapper<any[]>>(
    "/admin/pending-advisors"
  );
  return res.data;
};

// ================= APPROVE ADVISOR =================
export const approveAdvisorApi = async (
  userId: string
) => {
  const res = await api.post<ApiWrapper<string>>(
    `/admin/approve/${userId}`
  );
  return res.data;
};

// ================= DELETE / DISABLE ADVISOR =================
export const deleteAdvisorApi = async (
  userId: string
) => {
  const res = await api.delete<ApiWrapper<string>>(
    `/admin/delete/${userId}`
  );
  return res.data;
};
