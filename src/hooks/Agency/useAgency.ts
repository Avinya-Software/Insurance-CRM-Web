import { useState } from "react";
import toast from "react-hot-toast";
import { getAgencyListApi } from "../../api/agency.api";

export const useAgency = () => {
  const [loading, setLoading] = useState(false);

  const getAgencies = async (type: number) => {
    try {
      setLoading(true);

      const agencies = await getAgencyListApi(type);

      return agencies || [];
    } catch (error) {
      toast.error("Failed to load agencies");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    getAgencies,
    loading,
  };
};