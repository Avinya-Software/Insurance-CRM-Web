import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
const DROPDOWN_HEIGHT = 160;
const DROPDOWN_WIDTH = 210;
const LeadTable = ({ data = [], onEdit, onAdd, onCreateFollowUp, onViewFollowUps, onRowClick, }) => {
    const [openLead, setOpenLead] = useState(null);
    const [style, setStyle] = useState({
        top: 0,
        left: 0,
    });
    const dropdownRef = useRef(null);
    useOutsideClick(dropdownRef, () => setOpenLead(null));
    const openDropdown = (e, lead) => {
        e.stopPropagation(); // 🔥 IMPORTANT
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
        setOpenLead(lead);
    };
    /* 🔥 SAFE ACTION HANDLER */
    const handleAction = (cb) => {
        setOpenLead(null);
        setTimeout(cb, 0);
    };
    return (_jsxs("div", { className: "relative", children: [_jsxs("table", { className: "w-full text-sm border-collapse", children: [_jsx("thead", { className: "bg-slate-100 sticky top-0 z-10", children: _jsxs("tr", { children: [_jsx(Th, { children: "Lead No" }), _jsx(Th, { children: "Name" }), _jsx(Th, { children: "Email" }), _jsx(Th, { children: "Mobile" }), _jsx(Th, { children: "Status" }), _jsx(Th, { children: "Source" }), _jsx(Th, { children: "Created" }), _jsx(Th, { className: "text-right", children: "Actions" })] }) }), _jsx("tbody", { children: data.map((lead) => (_jsxs("tr", { onClick: () => onRowClick
                                ? onRowClick(lead)
                                : onViewFollowUps?.(lead), className: "border-t h-[52px] hover:bg-slate-50 cursor-pointer", children: [_jsx(Td, { children: lead.leadNo }), _jsx(Td, { children: lead.fullName }), _jsx(Td, { children: lead.email }), _jsx(Td, { children: lead.mobile }), _jsx(Td, { children: lead.leadStatus }), _jsx(Td, { children: lead.leadSource }), _jsx(Td, { children: new Date(lead.createdAt).toLocaleDateString() }), _jsx(Td, { className: "text-right", children: _jsx("button", { onClick: (e) => openDropdown(e, lead), className: "p-2 rounded hover:bg-slate-200", children: _jsx(MoreVertical, { size: 16 }) }) })] }, lead.leadId))) })] }), openLead && (_jsxs("div", { ref: dropdownRef, onClick: (e) => e.stopPropagation(), className: "fixed z-50 w-[210px] bg-white border rounded-lg shadow-lg overflow-hidden", style: { top: style.top, left: style.left }, children: [openLead.leadStatus !== "Lost" &&
                        openLead.leadStatus !== "Converted" && (_jsxs(_Fragment, { children: [_jsx(MenuItem, { label: "Edit Lead", onClick: () => handleAction(() => onEdit(openLead)) }), _jsx(MenuItem, { label: "Create Follow Up", onClick: () => handleAction(() => onCreateFollowUp?.(openLead)) })] })), _jsx(MenuItem, { label: "View Follow Ups", onClick: () => handleAction(() => onViewFollowUps?.(openLead)) })] }))] }));
};
/* ---------- Helpers ---------- */
const Th = ({ children, className = "" }) => (_jsx("th", { className: `px-4 py-3 text-left font-semibold ${className}`, children: children }));
const Td = ({ children, className = "" }) => (_jsx("td", { className: `px-4 py-3 ${className}`, children: children }));
const MenuItem = ({ label, onClick, }) => (_jsx("button", { onClick: (e) => {
        e.stopPropagation(); // 🔥 PREVENT ROW CLICK
        onClick();
    }, className: "w-full text-left px-4 py-2 text-sm hover:bg-slate-100", children: label }));
export default LeadTable;
