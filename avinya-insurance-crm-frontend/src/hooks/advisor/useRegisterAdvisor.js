import { useMutation } from "@tanstack/react-query";
import { registerAdvisorApi } from "../../api/advisor.api";
export const useRegisterAdvisor = () => {
    return useMutation({
        mutationFn: (data) => registerAdvisorApi(data),
    });
};
