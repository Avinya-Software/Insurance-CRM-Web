import api from "../../api/axios";
import { deletePolicyDocumentApi } from "../../api/policy.api";
import toast from "react-hot-toast";

export const usePolicyDocumentActions = (
  onDeleteSuccess?: (documentId: string) => void
) => {

  const preview = async (policyId: string, documentId: string) => {
    try {
      const res = await api.get(
        `/policy/${policyId}/documents/${documentId}/preview`
      );

      const fileUrl = res.data?.data?.url;

      if (!fileUrl) throw new Error("File URL not found");

      window.open(fileUrl, "_blank");

    } catch (error) {
      console.error("Preview error:", error);
      toast.error("Failed to preview document");
    }
  };

  const download = async (
    policyId: string,
    documentId: string,
    fileName?: string
  ) => {
    try {
      const res = await api.get(
        `/policy/${policyId}/documents/${documentId}/preview`
      );

      const fileUrl = res.data?.data?.url;
      const name = fileName ?? res.data?.data?.fileName ?? "document";

      if (!fileUrl) throw new Error("File URL not found");

      const response = await fetch(fileUrl);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(blobUrl);

      toast.success("Download Successfully");

    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  const remove = async (policyId: string, documentId: string) => {
    try {
      await deletePolicyDocumentApi(policyId, documentId);
      toast.success("Policy document deleted");
      onDeleteSuccess?.(documentId);
    } catch (error) {
      toast.error("Failed to delete document");
      throw error;
    }
  };

  return { preview, download, remove };
};
