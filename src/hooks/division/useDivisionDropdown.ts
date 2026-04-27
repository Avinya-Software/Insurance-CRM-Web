import { useQuery } from "@tanstack/react-query";
import { getDivisionDropdownApi } from "../../api/division.api";
import { Division } from "../../interfaces/division.interface";

export const useDivisionDropdown = (id?: number) => {
  return useQuery<Division[]>({
    queryKey: ["division-dropdown", id],
    queryFn: async () => {
      const res = await getDivisionDropdownApi(id);
      return res.data;
    },
  });
};
