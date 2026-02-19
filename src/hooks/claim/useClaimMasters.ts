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
    initialData: [],
  });

export const useClaimStages = () =>
  useQuery({
    queryKey: ["claim-stages"],
    queryFn: getClaimStagesApi,
    initialData: [],
  });

export const useClaimHandlers = () =>
  useQuery({
    queryKey: ["claim-handlers"],
    queryFn: getClaimHandlersApi,
    initialData: [],
  });


