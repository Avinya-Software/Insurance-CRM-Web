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
