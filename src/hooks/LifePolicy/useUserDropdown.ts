import { useQuery } from "@tanstack/react-query";
import { getUserDropdownApi } from "../../api/policy.api";

export const useUserDropdown = () => {
    return useQuery({
      queryKey: ["user-dropdown"],
      queryFn: getUserDropdownApi,
    });
  };