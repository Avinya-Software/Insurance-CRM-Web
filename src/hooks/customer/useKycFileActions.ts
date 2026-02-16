import toast from "react-hot-toast";
import { deleteKycFileApi } from "../../api/customer.api";

export const useKycFileActions = (
  onDeleted?: (documentId: string) => void
) => {
  const preview = async (fileUrl: string) => {
    try {
      if (!fileUrl) throw new Error("Invalid file URL");
  
      window.open(fileUrl, "_blank", "noopener,noreferrer");
  
    } catch (err) {
      console.error("Preview failed:", err);
      toast.error("Preview failed");
    }
  };
  
  const download = async (fileUrl: string, fileName?: string) => {
    try {
      const response = await fetch(fileUrl);
  
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }
      const blob = await response.blob();
  
      const name =
        fileName ??
        fileUrl.split("/").pop() ??
        "document";
  
      const blobUrl = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      window.URL.revokeObjectURL(blobUrl);
  
      toast.success("Download Successfully");
  
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Download failed");
    }
  };
  const remove = async (customerId: string, documentId: string) => {
    await deleteKycFileApi(customerId, documentId);
    toast.success("Document deleted");
    onDeleted?.(documentId); 
  };
  
  return { preview, download, remove };
};
