import { useQuery } from "@tanstack/react-query";
import {
  getClaimStatusApi,
  getClaimTypeApi,
} from "../../api/claim-master.api";

export const useClaimStatus = () =>
  useQuery({
    queryKey: ["claim-status-dropdown"],
    queryFn: getClaimStatusApi,
    initialData: [],
  });

export const useClaimType = () =>
  useQuery({
    queryKey: ["claim-type-dropdown"],
    queryFn: getClaimTypeApi,
    initialData: [],
  });


