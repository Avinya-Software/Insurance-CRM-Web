import toast from "react-hot-toast";
import api from "../../api/axios";
import { deleteKycFileApi } from "../../api/customer.api";

export const useKycFileActions = () => {
  const preview = async (customerId: string, documentId: string) => {
    const res = await api.get(
      `/Customer/${customerId}/kyc/${documentId}/preview`,
      { responseType: "blob" }
    );

    console.log("📄 Preview API response:", res);
    console.log("📄 Preview blob:", res.data);

    const url = URL.createObjectURL(res.data);
    console.log("🔗 Preview object URL:", url);
  };

  const download = async (customerId: string, documentId: string, fileName?: string) => {
    try {
      const res = await api.get(`/Customer/${customerId}/kyc/${documentId}/download`, {
        responseType: "blob",
      });
  
      const mimeType = res.headers["content-type"] || "application/octet-stream";
      const blob = new Blob([res.data], { type: mimeType });
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName ?? "document"; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    } catch (err) {
      console.error(err);
      toast.error("Download failed");
    }
  };
  
  
  const remove = async (
    customerId: string,
    documentId: string
  ) => {
    await deleteKycFileApi(customerId, documentId);
  };

  return { preview, download, remove };
};
