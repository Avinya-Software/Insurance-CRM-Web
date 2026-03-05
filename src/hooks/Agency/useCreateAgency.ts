import { useState } from "react";
import toast from "react-hot-toast";
import { AgencyPayload } from "../../interfaces/agency.interface";
import { upsertAgency } from "../../api/agency.api";

export const useCreateAgency = () => {
  const [saving, setSaving] = useState(false);

  const saveAgency = async (payload: AgencyPayload, isEdit: boolean) => {
    setSaving(true);

    try {
      await upsertAgency(payload);

      if (isEdit) {
        toast.success("Agency updated successfully");
      } else {
        toast.success("Agency created successfully");
      }

      return true;
    } catch (err) {
      toast.error("Failed to save agency");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    saveAgency,
  };
};