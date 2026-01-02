import api from "./axios";
import type {
  CreateClaimRequest,
  ClaimFilters,
  ClaimResponse,
} from "../interfaces/claim.interface";

/* ---------------- CREATE / UPDATE CLAIM ---------------- */
export const upsertClaimApi = async (data: CreateClaimRequest) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "documents" && Array.isArray(value)) {
        value.forEach(file => formData.append("Documents", file));
      } else {
        formData.append(key, value as any);
      }
    }
  });

  const res = await api.post<ClaimResponse>("/claim", formData);
  return res.data;
};

/* ---------------- GET CLAIMS (PAGINATED) ---------------- */
export const getClaimsApi = async (params: ClaimFilters) => {
  const res = await api.get("/claim", { params });
  return res.data;
};
