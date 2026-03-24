import { useQuery } from "@tanstack/react-query";
import { getStatesApi, State } from "../../api/state-city.api";

export const useStates = () => {
  return useQuery<State[]>({
    queryKey: ["states"],
    queryFn: getStatesApi,
  });
};