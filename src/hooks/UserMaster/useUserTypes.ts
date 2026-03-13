import { useQuery } from "@tanstack/react-query";
import { getUserTypesApi } from "../../api/UserMaster.api";

export const useUserTypes = () => {
  return useQuery({
    queryKey: ["userTypes"],
    queryFn: getUserTypesApi,
  });
};
