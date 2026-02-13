import toast from "react-hot-toast";
import { deleteKycFileApi } from "../../api/customer.api";
import api from "../../api/axios";

export const useKycFileActions = (
  onDeleted?: (documentId: string) => void
) => {
  const preview = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Failed to fetch file");
  
      const blob = await response.blob();
  
      const blobType = blob.type;
      const blobUrl = URL.createObjectURL(blob);
  
      if (blobType === "application/pdf") {
        // Open PDF in new tab
        const pdfWindow = window.open("", "_blank");
        if (!pdfWindow) throw new Error("Unable to open new tab");
        pdfWindow.document.write(
          `<iframe src="${blobUrl}" width="100%" height="100%" style="border:none;"></iframe>`
        );
      } else {
        // For images / other types
        window.open(blobUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Preview failed:", err);
      toast.error("Preview failed");
    }
  };
  
  const download = async (fileUrl: string, fileName?: string) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Failed to fetch file");
  
      const blob = await response.blob();
      const name = fileName ?? fileUrl.split("/").pop() ?? "document";
  
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
  
      toast.success("Download Sucesfully");
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
