import { useState } from "react";
import {
  deleteMakeApi,
  getMakeListApi,
  upsertMakeApi
} from "../../api/make.api";

export const useMake = () => {

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const pageSize = 10;

  const getList = async (page = pageNumber, size = pageSize) => {

    setLoading(true);
  
    try {
  
      const res = await getMakeListApi(page, size);
  
      return {
        data: res?.data || [],
        totalPages: Math.ceil((res?.totalCount || 0) / size)
      };
  
    } finally {
      setLoading(false);
    }
  };

  const saveMake = async (payload: any) => {
    const res = await upsertMakeApi(payload);
    return res?.statusCode === 200;
  };

  const deleteMake = async (id: string) => {
    const res = await deleteMakeApi(id);
    return res?.statusCode === 200;
  };

  return {
    loading,
    pageNumber,
    setPageNumber,
    getList,
    saveMake,
    deleteMake
  };
};