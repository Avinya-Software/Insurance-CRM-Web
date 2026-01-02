import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getLeadsApi } from "../../api/lead.api";
export const useLeads = (filters) => {
    return useQuery({
        queryKey: ["leads", filters],
        queryFn: () => getLeadsApi(filters),
        placeholderData: keepPreviousData,
    });
};
