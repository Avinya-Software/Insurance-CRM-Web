import api from "./axios";
// REGISTER
export const registerAdvisorApi = async (data) => {
    const res = await api.post("/Advisor/register", data);
    return res.data;
};
// LOGIN
export const loginAdvisorApi = async (data) => {
    const res = await api.post("/Advisor/login", data);
    return res.data;
};
