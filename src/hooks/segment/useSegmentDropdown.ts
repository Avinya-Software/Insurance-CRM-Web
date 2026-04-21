import { useQuery } from "@tanstack/react-query";
import { getSegmentListApi } from "../../api/segment.api";
import { Segment } from "../../interfaces/segment.interface";

export const useSegmentDropdown = (divisionid?: number) => {
  return useQuery<Segment[]>({
    queryKey: ["segment-dropdown", divisionid],
    queryFn: async () => {
      const res = await getSegmentListApi(divisionid);
      return res;
    },
    enabled: !!divisionid && divisionid !== 0,
  });
};
