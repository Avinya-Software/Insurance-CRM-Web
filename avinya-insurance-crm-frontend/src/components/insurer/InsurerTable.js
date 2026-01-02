import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
const DROPDOWN_HEIGHT = 80;
const DROPDOWN_WIDTH = 180;
const InsurerTable = ({ data = [], onEdit, onAddProduct, // ✅ IMPORTANT
 }) => {
    const [openInsurer, setOpenInsurer] = useState(null);
    const [style, setStyle] = useState({ top: 0, left: 0 });
    const dropdownRef = useRef(null);
    useOutsideClick(dropdownRef, () => setOpenInsurer(null));
    const openDropdown = (e, insurer) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setStyle({
            top: rect.bottom + 6,
            left: rect.right - DROPDOWN_WIDTH,
        });
        setOpenInsurer(insurer);
    };
    /* ---------------- ACTIONS ---------------- */
    const handleEdit = () => {
        if (!openInsurer)
            return;
        const insurer = openInsurer;
        setOpenInsurer(null);
        setTimeout(() => onEdit(insurer), 0);
    };
    const handleAddProduct = () => {
        if (!openInsurer)
            return;
        const insurer = openInsurer;
        setOpenInsurer(null);
        setTimeout(() => onAddProduct(insurer), 0);
    };
    return (_jsxs("div", { className: "relative overflow-x-auto", children: [_jsxs("table", { className: "w-full text-sm border-collapse", children: [_jsx("thead", { className: "bg-slate-100", children: _jsxs("tr", { children: [_jsx(Th, { children: "Name" }), _jsx(Th, { children: "Short Code" }), _jsx(Th, { children: "Portal" }), _jsx(Th, { children: "Username" }), _jsx(Th, { className: "text-center", children: "Actions" })] }) }), _jsxs("tbody", { children: [data.map((i) => (_jsxs("tr", { className: "border-t h-[52px] hover:bg-slate-50", children: [_jsx(Td, { children: i.insurerName }), _jsx(Td, { children: i.shortCode }), _jsx(Td, { children: i.portalUrl }), _jsx(Td, { children: i.portalUsername }), _jsx(Td, { className: "text-center", children: _jsx("button", { onClick: (e) => openDropdown(e, i), className: "p-2 rounded hover:bg-slate-200", children: _jsx(MoreVertical, { size: 16 }) }) })] }, i.insurerId))), !data.length && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "text-center py-6 text-slate-500", children: "No insurers found" }) }))] })] }), openInsurer && (_jsxs("div", { ref: dropdownRef, className: "fixed z-50 w-[180px] bg-white border rounded-lg shadow-lg", style: style, children: [_jsx(MenuItem, { label: "Edit Insurer", onClick: handleEdit }), _jsx(MenuItem, { label: "Add Product", onClick: handleAddProduct })] }))] }));
};
export default InsurerTable;
/* ---------- HELPERS ---------- */
const Th = ({ children }) => (_jsx("th", { className: "px-4 py-3 text-left font-semibold text-slate-700", children: children }));
const Td = ({ children, className = "" }) => (_jsx("td", { className: `px-4 py-3 ${className}`, children: children }));
const MenuItem = ({ label, onClick, }) => (_jsx("button", { onClick: onClick, className: "w-full text-left px-4 py-2 text-sm hover:bg-slate-100", children: label }));
