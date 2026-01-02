import { useQuery } from "@tanstack/react-query";
import {
  getClaimTypesApi,
  getClaimStagesApi,
  getClaimHandlersApi,
} from "../../api/claim-master.api";

export const useClaimTypes = () =>
  useQuery({
    queryKey: ["claim-types"],
    queryFn: getClaimTypesApi,
    staleTime: 10 * 60 * 1000,
  });

export const useClaimStages = () =>
  useQuery({
    queryKey: ["claim-stages"],
    queryFn: getClaimStagesApi,
    staleTime: 10 * 60 * 1000,
  });

export const useClaimHandlers = () =>
  useQuery({
    queryKey: ["claim-handlers"],
    queryFn: getClaimHandlersApi,
    staleTime: 10 * 60 * 1000,
  });
