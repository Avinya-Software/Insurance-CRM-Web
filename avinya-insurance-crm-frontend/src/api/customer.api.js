import api from "./axios";
export const createCustomerApi = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (key === "kycFiles" && Array.isArray(value)) {
                value.forEach(file => formData.append("kycFiles", file));
            }
            else {
                formData.append(key, value);
            }
        }
    });
    const res = await api.post("/Customer", formData);
    return res.data;
};
export const getCustomerDropdownApi = async () => {
    const res = await api.get("/Customer/dropdown");
    return res.data;
};
export const getCustomersApi = async (params) => {
    const res = await api.get("/Customer", {
        params,
    });
    return res.data.data;
};
