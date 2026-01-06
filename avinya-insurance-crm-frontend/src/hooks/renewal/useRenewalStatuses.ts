import { useQuery } from "@tanstack/react-query";
import { getRenewalStatusesApi } from "../../api/renewal.api";

export const useRenewalStatuses = () => {
  return useQuery({
    queryKey: ["renewal-statuses"],
    queryFn: getRenewalStatusesApi,
    staleTime: 5 * 60 * 1000, // cache 5 min
  });
};
