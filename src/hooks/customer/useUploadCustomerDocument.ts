import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { uploadCustomerDocumentApi } from "../../api/customer.api";

export const useUploadCustomerDocument = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await uploadCustomerDocumentApi(formData);
    },

    onSuccess: (response: any) => {
      toast.success(response?.statusMessage || "Document uploaded successfully");
    },
    

    onError: (error: any) => {
      const message =
        error?.response?.data?.statusMessage ||
        error?.response?.data?.message ||
        "Document upload failed";

      toast.error(message);
    }
  });
};