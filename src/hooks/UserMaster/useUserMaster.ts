import { useQuery } from "@tanstack/react-query";
import { getUserMasterListApi } from "../../api/UserMaster.api";

export const useUserMaster = (
  userTypeId: string | null,
  pageNumber: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: ["userMaster", userTypeId, pageNumber, pageSize],
    queryFn: () => getUserMasterListApi(userTypeId, pageNumber, pageSize),
  });
};
