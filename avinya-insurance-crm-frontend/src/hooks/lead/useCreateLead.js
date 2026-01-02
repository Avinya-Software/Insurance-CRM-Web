import { useMutation } from "@tanstack/react-query";
import api from "../../api/axios";
const createLeadApi = async (data) => {
    const res = await api.post("/Lead", data);
    return res.data;
};
export const useCreateLead = () => {
    return useMutation({
        mutationFn: createLeadApi,
    });
};
