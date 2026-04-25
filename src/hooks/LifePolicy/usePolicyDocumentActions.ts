import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePolicyDocumentApi } from "../../api/policy.api"; // ← use policy API

export const usePolicyDocumentActions = (
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
    await deletePolicyDocumentApi(policyId, documentId); 
    toast.success("Document deleted");
    queryClient.invalidateQueries({ queryKey: ["life-policies"] });
    onDeleted?.(documentId);
  };

  return { preview, download, remove };
};