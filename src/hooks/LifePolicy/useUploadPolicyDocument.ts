import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { uploadPolicyDocumentApi } from "../../api/policy.api";

export const useUploadPolicyDocument = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await uploadPolicyDocumentApi(formData);
    },
  });
};