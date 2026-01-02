import api from "./axios";
/* ---------------- ADD / UPDATE PRODUCT ---------------- */
export const upsertProductApi = async (payload) => {
    const res = await api.post("/products", payload);
    return res.data;
};
/* ---------------- PRODUCT CATEGORY DROPDOWN ---------------- */
export const getProductCategoryDropdownApi = async () => {
    const res = await api.get("/products/ProductCategorydropdown");
    return res.data;
};
/* ---------------- GET PRODUCTS (WITH FILTER + PAGINATION) ---------------- */
export const getProductsApi = async (params) => {
    const res = await api.get("/products", { params });
    return res.data;
};
export const getProductDropdownApi = async (insurerId) => {
    const res = await api.get("/products/dropdown", {
        params: insurerId ? { insurerId } : {},
    });
    return res.data;
};
