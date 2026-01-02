import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Filter } from "lucide-react";
import { usePolicies } from "../hooks/policy/usePolicies";
import PolicyTable from "../components/policy/PolicyTable";
import PolicyUpsertSheet from "../components/policy/PolicyUpsertSheet";
import PolicyFilterSheet from "../components/policy/PolicyFilterSheet";
import Pagination from "../components/leads/Pagination";
const Policies = () => {
    /* ---------------- STATE ---------------- */
    const [filters, setFilters] = useState({
        pageNumber: 1,
        pageSize: 10,
        search: "",
        policyStatusId: null,
        policyTypeId: null,
        customerId: null,
        insurerId: null,
        productId: null,
    });
    const [openPolicySheet, setOpenPolicySheet] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [openFilterSheet, setOpenFilterSheet] = useState(false);
    const { data, isLoading, isFetching } = usePolicies(filters);
    /* ---------------- HANDLERS ---------------- */
    const handleAddPolicy = () => {
        setSelectedPolicy(null);
        setOpenPolicySheet(true);
    };
    const handleEditPolicy = (policy) => {
        setSelectedPolicy(policy);
        setOpenPolicySheet(true);
    };
    const handlePolicySuccess = (isEdit) => {
        setOpenPolicySheet(false);
        setSelectedPolicy(null);
        toast.success(isEdit ? "Policy Saved successfully!" : "Policy Saved successfully!");
    };
    const handleClearFilters = () => {
        setFilters({
            pageNumber: 1,
            pageSize: 10,
            search: "",
            policyStatusId: null,
            policyTypeId: null,
            customerId: null,
            insurerId: null,
            productId: null,
        });
        toast.success("Filters cleared");
    };
    return (_jsxs(_Fragment, { children: [_jsx(Toaster, { position: "top-right", reverseOrder: false }), _jsxs("div", { className: "bg-white rounded-lg border", children: [_jsx("div", { className: "px-4 py-5 border-b bg-gray-100", children: _jsxs("div", { className: "grid grid-cols-2 gap-y-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-serif font-semibold", children: "Policies" }), _jsxs("p", { className: "mt-1 text-sm text-slate-600", children: [data?.totalRecords ?? 0, " total policies"] })] }), _jsx("div", { className: "text-right", children: _jsx("button", { className: "bg-blue-900 text-white px-4 py-2 rounded text-sm", onClick: handleAddPolicy, children: "+ Add Policy" }) }), _jsx("div", { children: _jsxs("div", { className: "relative w-[360px]", children: [_jsx("input", { placeholder: "Search by policy number...", value: filters.search, onChange: (e) => setFilters({
                                                    ...filters,
                                                    search: e.target.value,
                                                    pageNumber: 1,
                                                }), className: "w-full h-10 pl-10 border rounded" }), _jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2", children: "\uD83D\uDD0D" })] }) }), _jsx("div", { className: "text-right", children: _jsxs("button", { onClick: () => setOpenFilterSheet(true), className: "inline-flex items-center gap-2 border px-4 py-2 rounded", children: [_jsx(Filter, { size: 16 }), "Filters"] }) })] }) }), (isLoading || isFetching) && (_jsx("div", { className: "px-4 py-2 text-sm text-slate-500", children: isLoading ? "Loading..." : "Updating..." })), _jsx(PolicyTable, { data: data?.data ?? [], onEdit: handleEditPolicy }), _jsx("div", { className: "border-t px-4 py-3", children: _jsx(Pagination, { page: filters.pageNumber, totalPages: data?.totalPages || 1, onChange: (page) => setFilters({ ...filters, pageNumber: page }) }) })] }), _jsx(PolicyFilterSheet, { open: openFilterSheet, filters: filters, onClose: () => setOpenFilterSheet(false), onApply: (f) => {
                    setFilters({ ...f, pageNumber: 1 });
                    toast.success("Filters applied");
                }, onClear: handleClearFilters }), _jsx(PolicyUpsertSheet, { open: openPolicySheet, policy: selectedPolicy, onClose: () => {
                    setOpenPolicySheet(false);
                    setSelectedPolicy(null);
                }, onSuccess: handlePolicySuccess })] }));
};
export default Policies;
