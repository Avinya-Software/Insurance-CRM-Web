import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  deleteClaimDocumentApi,
} from "../../api/claim.api";
import toast from "react-hot-toast";

/**
 * Hook for Claim document actions
 * - Preview (blob)
 * - Download (blob)
 * - Delete (DB + folder)
 */
export const useClaimFileActions = (
  onDeleted?: (documentId: string) => void
) => {
  const queryClient = useQueryClient();
  /*  PREVIEW  */

  const preview = async (
    pathOrClaimId: string,
    documentId: string
  ) => {
    // If it's already a full URL, just open it
    if (pathOrClaimId.startsWith("http")) {
      window.open(pathOrClaimId, "_blank", "noopener,noreferrer");
      return;
    }

    try {
      const res = await api.get(
        `/Claim/claims/${pathOrClaimId}/documents/${documentId}/preview`,
        {
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(res.data);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Preview failed:", error);
      toast.error("Preview failed");
    }
  };

  /*  DOWNLOAD  */
  /* ⬇️ Forces file download */

  const download = async (
    pathOrClaimId: string,
    documentIdOrFileName: string
  ) => {
    if (pathOrClaimId.startsWith("http")) {
      try {
        const res = await fetch(pathOrClaimId);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = documentIdOrFileName || "document";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 3000);
        toast.success("Downloaded successfully");
      } catch (err) {
        console.error("Download failed:", err);
        toast.error("Download failed");
      }
      return;
    }

    try {
      const res = await api.get(
        `/Claim/claims/${pathOrClaimId}/documents/${documentIdOrFileName}/download`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "document";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed");
    }
  };

  /*  DELETE  */

  const remove = async (
    claimId: string,
    documentId: string
  ) => {
    await deleteClaimDocumentApi(
      claimId,
      documentId
    );

    toast.success("Document deleted");

    // Refresh background table
    queryClient.invalidateQueries({ queryKey: ["claims"] });

    //  notify UI to remove item without refetch
    onDeleted?.(documentId);
  };

  return {
    preview,
    download,
    remove,
  };
};
