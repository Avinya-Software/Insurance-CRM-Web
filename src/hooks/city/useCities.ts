import { useQuery } from "@tanstack/react-query";
import { getCitiesByStateApi, City } from "../../api/state-city.api";

export const useCities = (stateId: number | null) => {
  return useQuery<City[]>({
    queryKey: ["cities", stateId],
    queryFn: () => getCitiesByStateApi(stateId!),
    enabled: !!stateId,           // only fetch when a state is selected
  });
};