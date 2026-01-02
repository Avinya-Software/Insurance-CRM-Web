import api from "./axios";
/* ---------------- UPSERT POLICY ---------------- */
export const upsertPolicyApi = async (data) => {
    const res = await api.post("/policy/upsert", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};
/* ---------------- DROPDOWNS ---------------- */
export const getPolicyTypesDropdownApi = async () => {
    const res = await api.get("/policy/policy-types-dropdown");
    return res.data;
};
export const getPolicyStatusesDropdownApi = async () => {
    const res = await api.get("/policy/policy-statuses-dropdown");
    return res.data;
};
export const getPoliciesApi = async (params) => {
    const res = await api.get("/policy", { params });
    return res.data;
};
