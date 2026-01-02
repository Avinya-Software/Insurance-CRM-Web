import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useMemo } from "react";
import { MoreVertical } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useInsurerDropdown } from "../../hooks/insurer/useInsurerDropdown";
const DROPDOWN_HEIGHT = 80;
const DROPDOWN_WIDTH = 180;
const ProductTable = ({ data = [], onEdit }) => {
    const [openProduct, setOpenProduct] = useState(null);
    const [style, setStyle] = useState({ top: 0, left: 0 });
    const dropdownRef = useRef(null);
    useOutsideClick(dropdownRef, () => setOpenProduct(null));
    /* 🔥 INSURER DROPDOWN */
    const { data: insurers } = useInsurerDropdown();
    /* 🔥 BUILD ID → NAME MAP */
    const insurerMap = useMemo(() => {
        const map = {};
        insurers?.forEach((i) => {
            map[i.insurerId] = i.insurerName;
        });
        return map;
    }, [insurers]);
    const openDropdown = (e, product) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setStyle({
            top: rect.bottom + 6,
            left: rect.right - DROPDOWN_WIDTH,
        });
        setOpenProduct(product);
    };
    const handleEdit = () => {
        if (!openProduct)
            return;
        onEdit(openProduct);
        setOpenProduct(null);
    };
    return (_jsxs("div", { className: "relative overflow-x-auto", children: [_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-slate-100", children: _jsxs("tr", { children: [_jsx(Th, { children: "Product" }), _jsx(Th, { children: "Code" }), _jsx(Th, { children: "Category" }), _jsx(Th, { children: "Insurer" }), _jsx(Th, { children: "Status" }), _jsx(Th, { className: "text-center", children: "Actions" })] }) }), _jsxs("tbody", { children: [data.map((p) => (_jsxs("tr", { className: "border-t h-[52px]", children: [_jsx(Td, { children: p.productName }), _jsx(Td, { children: p.productCode }), _jsx(Td, { children: p.productCategory }), _jsx(Td, { children: insurerMap[p.insurerId] ?? "-" }), _jsx(Td, { children: p.isActive ? "Active" : "Inactive" }), _jsx(Td, { className: "text-center", children: _jsx("button", { onClick: (e) => openDropdown(e, p), className: "p-2 rounded hover:bg-slate-200", children: _jsx(MoreVertical, { size: 16 }) }) })] }, p.productId))), !data.length && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "text-center py-6 text-slate-500", children: "No products found" }) }))] })] }), openProduct && (_jsx("div", { ref: dropdownRef, className: "fixed z-50 w-[180px] bg-white border rounded shadow", style: style, children: _jsx(MenuItem, { label: "Edit Product", onClick: handleEdit }) }))] }));
};
export default ProductTable;
/* helpers */
const Th = ({ children }) => (_jsx("th", { className: "px-4 py-3 text-left font-semibold", children: children }));
const Td = ({ children }) => (_jsx("td", { className: "px-4 py-3", children: children }));
const MenuItem = ({ label, onClick }) => (_jsx("button", { onClick: onClick, className: "w-full text-left px-4 py-2 hover:bg-slate-100", children: label }));
