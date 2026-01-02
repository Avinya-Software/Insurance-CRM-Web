import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Filter } from "lucide-react";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useLeads } from "../hooks/lead/useLeads";
import LeadTable from "../components/leads/LeadTable";
import Pagination from "../components/leads/Pagination";
import LeadFilterSheet from "../components/leads/LeadFilterSheet";
import LeadUpsertSheet from "../components/leads/LeadUpsertSheet";
import LeadFollowUpBottomSheet from "../components/followups/LeadFollowUpBottomSheet";
import LeadFollowUpCreateSheet from "../components/followups/LeadFollowUpCreateSheet";
const Leads = () => {
    /* ---------------- STATE ---------------- */
    const [filters, setFilters] = useState({
        pageNumber: 1,
        pageSize: 10,
        search: "",
    });
    const [openLeadSheet, setOpenLeadSheet] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [openFilterSheet, setOpenFilterSheet] = useState(false);
    const [viewFollowUpLead, setViewFollowUpLead] = useState(null);
    const [createFollowUpLead, setCreateFollowUpLead] = useState(null);
    const advisorId = useSelector((state) => state.auth.advisorId);
    const { data, isLoading, isFetching } = useLeads(filters);
    /* ---------------- COMMON HANDLERS ---------------- */
    const closeAllSheets = () => {
        setViewFollowUpLead(null);
        setCreateFollowUpLead(null);
    };
    const openViewFollowUps = (lead) => {
        closeAllSheets();
        setViewFollowUpLead({
            leadId: lead.leadId,
            leadName: lead.fullName,
        });
    };
    const handleAddLead = () => {
        closeAllSheets();
        setSelectedLead(null);
        setOpenLeadSheet(true);
    };
    const handleEditLead = (lead) => {
        closeAllSheets();
        setSelectedLead(lead);
        setOpenLeadSheet(true);
    };
    return (_jsxs(_Fragment, { children: [_jsx(Toaster, { position: "top-right", reverseOrder: false }), _jsxs("div", { className: "bg-white rounded-lg border", children: [_jsx("div", { className: "px-4 py-5 border-b bg-gray-100", children: _jsxs("div", { className: "grid grid-cols-2 gap-y-4 items-start", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-serif font-semibold text-slate-900", children: "Leads" }), _jsxs("p", { className: "mt-1 text-sm text-slate-600", children: [data?.totalRecords ?? 0, " total leads"] })] }), _jsx("div", { className: "text-right", children: _jsxs("button", { className: "inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium", onClick: handleAddLead, children: [_jsx("span", { className: "text-lg leading-none", children: "+" }), "Add Lead"] }) }), _jsx("div", { children: _jsxs("div", { className: "relative w-[360px]", children: [_jsx("input", { type: "text", placeholder: "Search leads by name, email, or phone...", value: filters.search, onChange: (e) => setFilters({
                                                    ...filters,
                                                    search: e.target.value,
                                                    pageNumber: 1,
                                                }), className: "w-full h-10 pl-10 pr-3 border rounded text-sm" }), _jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", children: "\uD83D\uDD0D" })] }) }), _jsx("div", { className: "text-right", children: _jsxs("button", { onClick: () => setOpenFilterSheet(true), className: "inline-flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium", children: [_jsx(Filter, { size: 16 }), "Filters"] }) })] }) }), (isLoading || isFetching) && (_jsx("div", { className: "px-4 py-2 text-sm text-slate-500", children: isLoading ? "Loading..." : "Updating..." })), _jsx(LeadTable, { data: data?.data ?? [], onAdd: handleAddLead, onEdit: handleEditLead, onRowClick: openViewFollowUps, onViewFollowUps: openViewFollowUps, onCreateFollowUp: (lead) => {
                            closeAllSheets();
                            setCreateFollowUpLead({
                                leadId: lead.leadId,
                                leadName: lead.fullName,
                            });
                        } }), _jsx("div", { className: "border-t px-4 py-3", children: _jsx(Pagination, { page: filters.pageNumber, totalPages: data?.totalPages || 1, onChange: (page) => setFilters({ ...filters, pageNumber: page }) }) })] }), _jsx(LeadFilterSheet, { open: openFilterSheet, onClose: () => setOpenFilterSheet(false), filters: filters, onApply: (f) => setFilters({ ...f, pageNumber: 1 }), onClear: () => setFilters({ pageNumber: 1, pageSize: 10, search: "" }) }), _jsx(LeadUpsertSheet, { open: openLeadSheet, onClose: () => {
                    setOpenLeadSheet(false);
                    setSelectedLead(null);
                }, lead: selectedLead, advisorId: advisorId }), _jsx(LeadFollowUpBottomSheet, { open: !!viewFollowUpLead, leadId: viewFollowUpLead?.leadId || null, leadName: viewFollowUpLead?.leadName, onClose: () => setViewFollowUpLead(null) }), _jsx(LeadFollowUpCreateSheet, { open: !!createFollowUpLead, leadId: createFollowUpLead?.leadId || null, leadName: createFollowUpLead?.leadName, onClose: () => setCreateFollowUpLead(null), onSuccess: () => {
                    setCreateFollowUpLead(null);
                    setViewFollowUpLead(createFollowUpLead);
                } })] }));
};
export default Leads;
