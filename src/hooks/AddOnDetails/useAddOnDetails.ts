import { useQuery } from "@tanstack/react-query";
import { getAddOnDetailsApi } from "../../api/addOnDetails.api";
import { AddOnDetail } from "../../interfaces/addondetails.interface";

export const useAddOnDetails = () => {
  return useQuery<AddOnDetail[]>({
    queryKey: ["addOnDetails"],
    queryFn: getAddOnDetailsApi,
  });
};