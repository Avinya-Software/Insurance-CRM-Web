import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useProducts } from "../hooks/product/useProducts";
import { useProductCategoryDropdown } from "../hooks/product/useProductCategoryDropdown";
import ProductTable from "../components/product/ProductTable";
import ProductUpsertSheet from "../components/product/ProductUpsertSheet";
const Products = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [productCategoryId, setProductCategoryId] = useState();
    const [openSheet, setOpenSheet] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    /* 🔥 API CALL */
    const { data, isLoading, refetch } = useProducts({
        pageNumber,
        pageSize,
        search,
        productCategoryId,
    });
    const { data: categories } = useProductCategoryDropdown();
    const products = data?.data?.products || [];
    const totalRecords = data?.data?.totalRecords || 0;
    /* ---------------- HANDLERS ---------------- */
    const handleAdd = () => {
        setSelectedProduct(null);
        setOpenSheet(true);
    };
    const handleEdit = (product) => {
        setSelectedProduct(product);
        setOpenSheet(true);
    };
    const handleSuccess = () => {
        // ✅ ONLY refetch here
        refetch();
        setOpenSheet(false);
        setSelectedProduct(null);
    };
    return (_jsxs(_Fragment, { children: [_jsx(Toaster, { position: "top-right", reverseOrder: false }), _jsxs("div", { className: "bg-white rounded-lg border", children: [_jsx("div", { className: "px-4 py-5 border-b bg-gray-100", children: _jsxs("div", { className: "grid grid-cols-2 gap-y-4 items-start", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-serif font-semibold", children: "Products" }), _jsxs("p", { className: "mt-1 text-sm text-slate-600", children: [totalRecords, " total products"] })] }), _jsx("div", { className: "text-right", children: _jsx("button", { className: "inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm", onClick: handleAdd, children: "+ Add Product" }) }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "relative w-[280px]", children: [_jsx("input", { type: "text", placeholder: "Search by product name or code...", value: search, onChange: (e) => {
                                                        setSearch(e.target.value);
                                                        setPageNumber(1);
                                                    }, className: "w-full h-10 pl-10 pr-3 border rounded text-sm" }), _jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", children: "\uD83D\uDD0D" })] }), _jsxs("select", { className: "h-10 border rounded px-3 text-sm", value: productCategoryId ?? "", onChange: (e) => {
                                                const value = e.target.value;
                                                setProductCategoryId(value ? Number(value) : undefined);
                                                setPageNumber(1);
                                            }, children: [_jsx("option", { value: "", children: "All Categories" }), categories?.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }), _jsx("div", {})] }) }), _jsx(ProductTable, { data: products, onEdit: handleEdit }), _jsxs("div", { className: "flex items-center justify-end gap-4 px-4 py-3 border-t text-sm", children: [_jsx("button", { disabled: pageNumber === 1, onClick: () => setPageNumber((p) => p - 1), className: "disabled:text-slate-400", children: "Prev" }), _jsxs("span", { children: ["Page ", pageNumber] }), _jsx("button", { disabled: products.length < pageSize, onClick: () => setPageNumber((p) => p + 1), className: "disabled:text-slate-400", children: "Next" })] }), isLoading && (_jsx("div", { className: "px-4 py-2 text-sm text-slate-500", children: "Loading..." }))] }), _jsx(ProductUpsertSheet, { open: openSheet, product: selectedProduct, onClose: () => setOpenSheet(false), onSuccess: handleSuccess })] }));
};
export default Products;
