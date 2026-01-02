import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLeadStatuses } from "../../hooks/lead/useLeadStatuses";
import { useLeadSources } from "../../hooks/lead/useLeadSources";
const LeadFilterSheet = ({ open, onClose, filters, onApply, onClear }) => {
    const { data: statuses } = useLeadStatuses();
    const { data: sources } = useLeadSources();
    const [localFilters, setLocalFilters] = useState(filters);
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);
    if (!open)
        return null;
    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };
    const handleClear = () => {
        onClear();
        onClose();
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex", children: [_jsx("div", { className: "flex-1 bg-black/30", onClick: onClose }), _jsxs("div", { className: "w-96 bg-white h-full shadow-xl flex flex-col ", children: [_jsxs("div", { className: "px-6 py-4 border-b flex justify-between items-center", children: [_jsx("h2", { className: "font-semibold text-lg", children: "Filter Leads" }), _jsx("button", { onClick: onClose, className: "hover:bg-gray-100 p-1 rounded", children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-6 py-4 space-y-4", children: [_jsx(Input, { label: "Full Name", value: localFilters.fullName || "", onChange: (v) => setLocalFilters({ ...localFilters, fullName: v }), placeholder: "Search by name..." }), _jsx(Input, { label: "Email", value: localFilters.email || "", onChange: (v) => setLocalFilters({ ...localFilters, email: v }), placeholder: "Search by email..." }), _jsx(Input, { label: "Mobile", value: localFilters.mobile || "", onChange: (v) => setLocalFilters({ ...localFilters, mobile: v }), placeholder: "Search by mobile..." }), _jsx(Select, { label: "Lead Status", value: localFilters.leadStatusId || "", options: statuses, onChange: (v) => setLocalFilters({ ...localFilters, leadStatusId: v ? Number(v) : null }) }), _jsx(Select, { label: "Lead Source", value: localFilters.leadSourceId || "", options: sources, onChange: (v) => setLocalFilters({ ...localFilters, leadSourceId: v ? Number(v) : null }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-medium", children: "Page Size" }), _jsxs("select", { className: "input", value: localFilters.pageSize || 10, onChange: (e) => setLocalFilters({ ...localFilters, pageSize: Number(e.target.value) }), children: [_jsx("option", { value: 10, children: "10 per page" }), _jsx("option", { value: 25, children: "25 per page" }), _jsx("option", { value: 50, children: "50 per page" }), _jsx("option", { value: 100, children: "100 per page" })] })] })] }), _jsxs("div", { className: "px-6 py-4 border-t flex gap-3", children: [_jsx("button", { className: "flex-1 border rounded-lg py-2 hover:bg-gray-50", onClick: handleClear, children: "Clear All" }), _jsx("button", { className: "flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700", onClick: handleApply, children: "Apply Filters" })] })] })] }));
};
export default LeadFilterSheet;
/* ---- Small helpers ---- */
const Input = ({ label, value, onChange, placeholder }) => (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-medium", children: label }), _jsx("input", { className: "input w-full", value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder })] }));
const Select = ({ label, value, options, onChange }) => (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-medium", children: label }), _jsxs("select", { className: "input w-full", value: value, onChange: (e) => onChange(e.target.value), children: [_jsx("option", { value: "", children: "All" }), options?.map((o) => (_jsx("option", { value: o.id, children: o.name }, o.id)))] })] }));
