import { useState } from "react";
import toast from "react-hot-toast";
import { getAgencyListApi } from "../../api/agency.api";

export const useAgency = () => {
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  const getAgencies = async (type: number, page: number) => {
    try {
      setLoading(true);
  
      const agencies = await getAgencyListApi(type, page, pageSize);
  
      return agencies;
    } finally {
      setLoading(false);
    }
  };

  return {
    getAgencies,
    loading,
    pageNumber,
    setPageNumber,
    pageSize
  };
};