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
  
  const download = (fileUrl: string, fileName?: string) => {
    try {
      if (!fileUrl) throw new Error("Invalid file URL");
  
      const name = fileName ?? fileUrl.split("/").pop() ?? "document";
  
      fetch(fileUrl)
        .then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
  
          const a = document.createElement("a");
          a.href = url;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
  
          setTimeout(() => URL.revokeObjectURL(url), 3000);
  
          toast.success("Download Successfully");
        });
  
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
