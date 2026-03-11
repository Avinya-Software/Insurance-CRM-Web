import { useQuery } from "@tanstack/react-query";
import { getAgencyDropdownApi } from "../../api/policy.api";

export const useAgencyDropdown = () => {
    return useQuery({
      queryKey: ["agency-dropdown"],
      queryFn: getAgencyDropdownApi,
    });
  };