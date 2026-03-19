import api from "./axios";

/* GET PRODUCTS (WITH FILTER + PAGINATION) */
export const getProductsApi = async (
  pageNumber: number,
  pageSize: number,
  policyType?: boolean,
  search?: string
) => {
  const res = await api.get("/products", {
    params: {
      pageNumber,
      pageSize,
      ...(policyType !== undefined && { policyType }),
      ...(search ? { search } : {}),
    },
  });
  return res.data;
};

/* ADD / UPDATE PRODUCT */
export const upsertProductApi = async (payload: {
  productId?: number;
  companyId: string;
  policyType: boolean;
  insurance: number;
  productName: string;
}) => {
  const res = await api.post("/products", payload);
  return res.data;
};

/* DELETE PRODUCT (BY ID) */
export const deleteProductApi = async (productId: number) => {
  const res = await api.delete(`/products/${productId}`);
  return res.data;
};