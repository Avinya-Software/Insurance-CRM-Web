import { useEffect, useState } from "react";
import { getAddOnDetailsApi } from "../../api/policy.api";

export const useAddOnDetails = (insuranceTypeId?: number) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!insuranceTypeId) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getAddOnDetailsApi(insuranceTypeId);
        setData(res);
      } catch (error) {
        console.error("Failed to fetch AddOnDetails", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [insuranceTypeId]);

  return { data, isLoading };
};