import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { uploadPolicyDocumentApi } from "../../api/policy.api";

export const useUploadPolicyDocument = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await uploadPolicyDocumentApi(formData);
    },

    onSuccess: (response: any) => {
      toast.success(response?.statusMessage || "Policy document uploaded successfully");
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.statusMessage ||
        error?.response?.data?.message ||
        "Policy document upload failed";

      toast.error(message);
    },
  });
};