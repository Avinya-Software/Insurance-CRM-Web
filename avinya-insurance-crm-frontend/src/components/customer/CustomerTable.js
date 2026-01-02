import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
const DROPDOWN_HEIGHT = 80;
const DROPDOWN_WIDTH = 180;
const CustomerTable = ({ data = [], onEdit, onAddPolicy, // ✅ FIX: destructured here
 }) => {
    const [openCustomer, setOpenCustomer] = useState(null);
    const [style, setStyle] = useState({ top: 0, left: 0 });
    const dropdownRef = useRef(null);
    useOutsideClick(dropdownRef, () => setOpenCustomer(null));
    /* ---------------- DROPDOWN POSITION ---------------- */
    const openDropdown = (e, customer) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const openUpwards = spaceBelow < DROPDOWN_HEIGHT;
        setStyle({
            top: openUpwards
                ? rect.top - DROPDOWN_HEIGHT - 6
                : rect.bottom + 6,
            left: rect.right - DROPDOWN_WIDTH,
        });
        setOpenCustomer(customer);
    };
    /* ---------------- ACTIONS ---------------- */
    const handleEdit = () => {
        if (!openCustomer)
            return;
        const customer = openCustomer;
        setOpenCustomer(null);
        setTimeout(() => onEdit(customer), 0);
    };
    const handleAddPolicy = () => {
        if (!openCustomer)
            return;
        const customer = openCustomer;
        setOpenCustomer(null);
        setTimeout(() => onAddPolicy(customer), 0);
    };
    /* ================= UI ================= */
    return (_jsxs("div", { className: "relative overflow-x-auto", children: [_jsxs("table", { className: "w-full text-sm border-collapse", children: [_jsx("thead", { className: "bg-slate-100 sticky top-0 z-10", children: _jsxs("tr", { children: [_jsx(Th, { children: "Name" }), _jsx(Th, { children: "Email" }), _jsx(Th, { children: "Mobile" }), _jsx(Th, { children: "Address" }), _jsx(Th, { className: "text-center", children: "Actions" })] }) }), _jsxs("tbody", { children: [data.map((c) => (_jsxs("tr", { className: "border-t h-[52px] hover:bg-slate-50", children: [_jsx(Td, { children: c.fullName }), _jsx(Td, { children: c.email || "-" }), _jsx(Td, { children: c.primaryMobile }), _jsx(Td, { children: c.address || "-" }), _jsx(Td, { className: "text-center", children: _jsx("button", { onClick: (e) => openDropdown(e, c), className: "p-2 rounded hover:bg-slate-200", children: _jsx(MoreVertical, { size: 16 }) }) })] }, c.customerId))), !data.length && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "text-center py-6 text-slate-500", children: "No customers found" }) }))] })] }), openCustomer && (_jsxs("div", { ref: dropdownRef, className: "fixed z-50 w-[180px] bg-white border rounded-lg shadow-lg", style: style, children: [_jsx(MenuItem, { label: "Edit Customer", onClick: handleEdit }), _jsx(MenuItem, { label: "Add Policy", onClick: handleAddPolicy })] }))] }));
};
export default CustomerTable;
/* ---------- HELPERS ---------- */
const Th = ({ children }) => (_jsx("th", { className: "px-4 py-3 text-left font-semibold text-slate-700", children: children }));
const Td = ({ children }) => (_jsx("td", { className: "px-4 py-3", children: children }));
const MenuItem = ({ label, onClick, }) => (_jsx("button", { onClick: onClick, className: "w-full text-left px-4 py-2 text-sm hover:bg-slate-100", children: label }));
