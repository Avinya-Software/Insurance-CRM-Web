import { useState } from "react";
import {
  deleteModelApi,
  getModelListApi,
  upsertModelApi
} from "../../api/model.api";

export const useModel = () => {

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const pageSize = 10;

  const getList = async (page = pageNumber, size = pageSize) => {

    setLoading(true);
  
    try {
  
      const res = await getModelListApi(page, size);
  
      return {
        data: res?.data || [],
        totalPages: Math.ceil((res?.totalCount || 0) / size)
      };
  
    } finally {
      setLoading(false);
    }
  };

  const saveModel = async (payload: any) => {
    const res = await upsertModelApi(payload);
    return res?.statusCode === 200;
  };

  const deleteModel = async (id: string) => {
    const res = await deleteModelApi(id);
    return res?.statusCode === 200;
  };

  return {
    loading,
    pageNumber,
    setPageNumber,
    getList,
    saveModel,
    deleteModel
  };
};