import toast from "react-hot-toast";
import { deleteGeneralPolicyDocumentApi } from "../../api/policy.api";
import { useQueryClient } from "@tanstack/react-query";

export const useGeneralPolicyDocumentActions = (
  onDeleted?: (documentId: string) => void
) => {
  const queryClient = useQueryClient();

  /* PREVIEW */
  const preview = async (fileUrl: string) => {
    try {
      if (!fileUrl) throw new Error("Invalid file URL");
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Preview failed:", err);
      toast.error("Preview failed");
    }
  };

  /* DOWNLOAD */
  const download = (fileUrl: string, fileName?: string) => {
    try {
      if (!fileUrl) throw new Error("Invalid file URL");

      const name = fileName ?? fileUrl.split("/").pop() ?? "document";

      fetch(fileUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 3000);
          toast.success("Downloaded successfully");
        })
        .catch(() => toast.error("Download failed"));
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Download failed");
    }
  };

  /* DELETE */
  const remove = async (policyId: string, documentId: string) => {
    try {
      await deleteGeneralPolicyDocumentApi(policyId, documentId);
      toast.success("Document deleted");
      
      // Refresh general policies list
      queryClient.invalidateQueries({ queryKey: ["general-policies"] });
      // Refresh single policy details if needed
      queryClient.invalidateQueries({ queryKey: ["general-policy", policyId] });
      
      onDeleted?.(documentId);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete document");
    }
  };

  return { preview, download, remove };
};
