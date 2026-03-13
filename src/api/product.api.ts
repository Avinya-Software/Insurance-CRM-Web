import { ProductDropdown, ProductDropdownResponse } from "../interfaces/product.interface";
import api from "./axios";

/*  ADD / UPDATE PRODUCT  */
export const upsertProductApi = async (payload: {
  productId?: string;
  insurerId: string;
  productCategoryId: number;
  productName: string;
  productCode: string;
  defaultReminderDays: number;
  commissionRules?: string;
  isActive: boolean;
}) => {
  const res = await api.post("/products", payload);
  return res.data;
};


/*  PRODUCT CATEGORY DROPDOWN  */
export const getProductCategoryDropdownApi = async () => {
  const res = await api.get<{
    statusCode: number;
    statusMessage: string;
    data: { productCategoryId: number; categoryName: string }[];
  }>("/products/product-category-dropdown"); 

  return res.data.data.map((cat) => ({
    id: cat.productCategoryId,
    name: cat.categoryName,
  }));
};


/*  GET PRODUCTS (WITH FILTER + PAGINATION)  */
export const getProductsApi = async (params: {
  pageNumber: number;
  pageSize: number;
  productCategoryId?: number;
  search?: string;
}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

/*  PRODUCT DROPDOWN  */

export const getProductDropdownApi = async (
  insurerId?: string
): Promise<ProductDropdown[]> => {
  const res = await api.get<ProductDropdownResponse>("/products/dropdown", {
    params: insurerId ? { insurerId } : {},
  });
console.log(res.data);
  return res.data.data; // 👈 return the array only
};

/*  DELETE PRODUCT (BY ID)  */

export const deleteProductApi = async (
  productId: string
) => {
  const res = await api.delete(
    `/products/${productId}`
  );
  return res.data;
};
