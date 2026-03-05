import { useState } from "react";
import toast from "react-hot-toast";
import { deleteAgencyApi } from "../../api/agency.api";

export const useDeleteAgency = () => {
  const [deleting, setDeleting] = useState(false);

  const deleteAgency = async (id: string) => {
    try {
      setDeleting(true);

      await deleteAgencyApi(id);

      toast.success("Agency deleted successfully");

      return true;
    } catch (error) {
      toast.error("Failed to delete agency");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleteAgency,
    deleting,
  };
};