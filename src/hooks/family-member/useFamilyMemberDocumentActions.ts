import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteFamilyMemberDocumentApi } from "../../api/family-member.api";

export const useFamilyMemberDocumentActions = (onDeleteSuccess?: (id: string) => void) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: ({ familyMemberId, documentId }: { familyMemberId: string; documentId: string }) =>
      deleteFamilyMemberDocumentApi(familyMemberId, documentId),
    onSuccess: (_, variables) => {
      toast.success("Document deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["family-members"] });
      if (onDeleteSuccess) {
        onDeleteSuccess(variables.documentId);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete document");
    },
  });

  const preview = (url: string) => {
    if (!url) return;
    window.open(url, "_blank");
  };

  const download = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download document");
    }
  };

  const remove = async (familyMemberId: string, documentId: string) => {
     return deleteMutation.mutateAsync({ familyMemberId, documentId });
  };

  return {
    preview,
    download,
    remove,
    isDeleting: deleteMutation.isPending,
  };
};
