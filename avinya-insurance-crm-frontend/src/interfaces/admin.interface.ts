// ================= REQUESTS =================
export interface AdminLoginRequest {
  email: string;
  password: string;
}

// ================= RESPONSES =================
export interface AdminLoginResponse {
  email: string;
  token: string;
  expiresAt: string;
}

// ================= COMMON API WRAPPER =================
export interface ApiWrapper<T> {
  statusCode: number;
  message: string;
  data: T;
}
export interface AdvisorStatusResponse {
  userId: string;
  advisorId: string;
  fullName: string;
  email: string;
  actionDate: string | null;
  status: "approved" | "rejected";
}
