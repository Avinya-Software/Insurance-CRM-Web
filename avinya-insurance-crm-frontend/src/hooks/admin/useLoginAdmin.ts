import { useMutation } from "@tanstack/react-query";
import { loginAdminApi } from "../../api/admin.api";
import type { AdminLoginRequest } from "../../interfaces/admin.interface";
import { saveToken } from "../../utils/token";

export const useLoginAdmin = () => {
  return useMutation({
    mutationFn: (data: AdminLoginRequest) =>
      loginAdminApi(data),

    onSuccess: (res) => {
      // 🔐 Save JWT
      saveToken(res.data.token);

      // Optional: store admin info
      localStorage.setItem("admin", JSON.stringify(res.data));
    }
  });
};
