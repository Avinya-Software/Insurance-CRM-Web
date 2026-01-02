import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
const DROPDOWN_HEIGHT = 48;
const DROPDOWN_WIDTH = 180;
const PolicyTable = ({ data = [], onEdit }) => {
    const [openPolicy, setOpenPolicy] = useState(null);
    const [style, setStyle] = useState({
        top: 0,
        left: 0,
    });
    const dropdownRef = useRef(null);
    useOutsideClick(dropdownRef, () => setOpenPolicy(null));
    const openDropdown = (e, policy) => {
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
        setOpenPolicy(policy);
    };
    return (_jsxs("div", { className: "relative overflow-x-auto", children: [_jsxs("table", { className: "w-full text-sm border-collapse", children: [_jsx("thead", { className: "bg-slate-100", children: _jsxs("tr", { children: [_jsx(Th, { children: "Policy No" }), _jsx(Th, { children: "Start" }), _jsx(Th, { children: "End" }), _jsx(Th, { children: "Premium" }), _jsx(Th, { className: "text-center", children: "Actions" })] }) }), _jsx("tbody", { children: data.map((p) => (_jsxs("tr", { className: "border-t h-[52px]", children: [_jsx(Td, { children: p.policyNumber }), _jsx(Td, { children: p.startDate?.split("T")[0] }), _jsx(Td, { children: p.endDate?.split("T")[0] }), _jsx(Td, { children: p.premiumGross }), _jsx(Td, { className: "text-center", children: _jsx("button", { onClick: (e) => openDropdown(e, p), className: "p-2 rounded hover:bg-slate-200", children: _jsx(MoreVertical, { size: 16 }) }) })] }, p.policyId))) })] }), openPolicy && (_jsx("div", { ref: dropdownRef, className: "fixed z-50 w-[180px] bg-white border rounded-lg shadow-lg", style: style, children: _jsx(MenuItem, { label: "Edit Policy", onClick: () => {
                        setOpenPolicy(null);
                        onEdit(openPolicy);
                    } }) }))] }));
};
export default PolicyTable;
/* ---------- HELPERS ---------- */
const Th = ({ children }) => (_jsx("th", { className: "px-4 py-3 text-left font-semibold", children: children }));
const Td = ({ children }) => (_jsx("td", { className: "px-4 py-3", children: children }));
const MenuItem = ({ label, onClick, }) => (_jsx("button", { onClick: onClick, className: "w-full text-left px-4 py-2 text-sm hover:bg-slate-100", children: label }));
