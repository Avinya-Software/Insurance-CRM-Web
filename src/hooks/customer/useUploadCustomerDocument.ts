import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { uploadCustomerDocumentApi } from "../../api/customer.api";

export const useUploadCustomerDocument = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await uploadCustomerDocumentApi(formData);
    },
  });
};