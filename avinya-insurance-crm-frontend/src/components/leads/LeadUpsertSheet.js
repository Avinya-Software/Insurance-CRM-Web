import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useUpsertLead } from "../../hooks/lead/useUpsertLead";
import { useLeadStatuses } from "../../hooks/lead/useLeadStatuses";
import { useLeadSources } from "../../hooks/lead/useLeadSources";
import { getCustomerDropdownApi } from "../../api/customer.api";
const LeadUpsertSheet = ({ open, onClose, lead, advisorId, }) => {
    const { mutate, isPending } = useUpsertLead();
    const { data: statuses } = useLeadStatuses();
    const { data: sources } = useLeadSources();
    /* ---------------- LOCK BODY SCROLL ---------------- */
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);
    /* ---------------- CUSTOMER DROPDOWN ---------------- */
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    useEffect(() => {
        getCustomerDropdownApi().then(setCustomers);
    }, []);
    /* ---------------- FORM STATE ---------------- */
    const initialForm = {
        customerId: null,
        fullName: "",
        email: "",
        mobile: "",
        address: "",
        leadStatusId: "",
        leadSourceId: "",
        notes: "",
    };
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    /* ---------------- PREFILL (EDIT MODE) ---------------- */
    useEffect(() => {
        if (!open)
            return;
        if (lead) {
            // 🔥 MAP VALUE → ID FOR STATUS
            const mappedStatusId = lead.leadStatusId ||
                statuses?.find((s) => s.name?.toLowerCase() ===
                    lead.leadStatus?.toLowerCase())?.id ||
                "";
            // 🔥 MAP VALUE → ID FOR SOURCE
            const mappedSourceId = lead.leadSourceId ||
                sources?.find((s) => s.name?.toLowerCase() ===
                    lead.leadSource?.toLowerCase())?.id ||
                "";
            setForm({
                customerId: lead.customerId ?? null,
                fullName: lead.fullName ?? "",
                email: lead.email ?? "",
                mobile: lead.mobile ?? "",
                address: lead.address ?? "",
                leadStatusId: mappedStatusId,
                leadSourceId: mappedSourceId,
                notes: lead.notes ?? "",
            });
            setSelectedCustomerId(lead.customerId ?? "");
        }
        else {
            setForm(initialForm);
            setSelectedCustomerId("");
        }
        setErrors({});
    }, [open, lead, statuses, sources]);
    /* ---------------- CUSTOMER SELECT ---------------- */
    const handleCustomerSelect = (customerId) => {
        setSelectedCustomerId(customerId);
        if (!customerId) {
            setForm(initialForm);
            return;
        }
        const customer = customers.find((c) => c.customerId === customerId);
        if (!customer)
            return;
        setForm((f) => ({
            ...f,
            customerId: customer.customerId,
            fullName: customer.fullName,
            email: customer.email,
            mobile: customer.primaryMobile ?? "",
            address: customer.address ?? "",
        }));
    };
    /* ---------------- VALIDATION ---------------- */
    const validate = () => {
        const e = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!form.fullName.trim())
            e.fullName = "Full name is required";
        if (!form.email.trim())
            e.email = "Email is required";
        else if (!emailRegex.test(form.email))
            e.email = "Invalid email";
        if (!form.mobile.trim())
            e.mobile = "Mobile is required";
        else if (!mobileRegex.test(form.mobile))
            e.mobile = "Invalid mobile number";
        if (!form.leadSourceId)
            e.leadSourceId = "Lead source is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    /* ---------------- SAVE ---------------- */
    const handleSave = () => {
        if (!validate())
            return;
        mutate({
            leadId: lead?.leadId,
            advisorId,
            ...form,
            leadStatusId: form.leadStatusId ||
                statuses?.find((s) => s.name === "New")?.id,
        }, { onSuccess: onClose });
    };
    if (!open)
        return null;
    /* =================== UI =================== */
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/40 z-[60]", onClick: onClose }), _jsxs("div", { className: "fixed top-0 right-0 h-screen w-[420px] bg-white z-[70] shadow-2xl animate-slideInRight flex flex-col", children: [_jsxs("div", { className: "px-6 py-4 border-b flex justify-between", children: [_jsx("h2", { className: "font-semibold", children: lead ? "Edit Lead" : "Add Lead" }), _jsx("button", { onClick: onClose, children: _jsx(X, {}) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-6 py-4 space-y-4", children: [_jsx(Select, { label: "Existing Customer (optional)", value: selectedCustomerId, options: customers.map((c) => ({
                                    id: c.customerId,
                                    name: `${c.fullName} (${c.email})`,
                                })), onChange: handleCustomerSelect }), _jsx(Input, { label: "Full Name", required: true, value: form.fullName, error: errors.fullName, onChange: (v) => setForm({ ...form, fullName: v }) }), _jsx(Input, { label: "Email", required: true, value: form.email, error: errors.email, onChange: (v) => setForm({ ...form, email: v }) }), _jsx(Input, { label: "Mobile", required: true, value: form.mobile, error: errors.mobile, onChange: (v) => setForm({ ...form, mobile: v }) }), _jsx(Input, { label: "Address", value: form.address, onChange: (v) => setForm({ ...form, address: v }) }), _jsx(Select, { label: "Lead Status", value: form.leadStatusId, options: statuses, onChange: (v) => setForm({ ...form, leadStatusId: v }) }), _jsx(Select, { label: "Lead Source", required: true, value: form.leadSourceId, options: sources, error: errors.leadSourceId, onChange: (v) => setForm({ ...form, leadSourceId: v }) }), _jsx(Textarea, { label: "Notes", value: form.notes, onChange: (v) => setForm({ ...form, notes: v }) })] }), _jsxs("div", { className: "px-6 py-4 border-t flex gap-3", children: [_jsx("button", { className: "flex-1 border rounded-lg py-2", onClick: onClose, children: "Cancel" }), _jsx("button", { disabled: isPending, className: "flex-1 bg-blue-600 text-white rounded-lg py-2", onClick: handleSave, children: isPending ? "Saving..." : "Save" })] })] })] }));
};
export default LeadUpsertSheet;
/* ---------------- HELPERS ---------------- */
const Input = ({ label, required, value, error, onChange }) => (_jsxs("div", { children: [_jsxs("label", { className: "text-sm font-medium", children: [label, " ", required && _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { className: `input w-full ${error ? "border-red-500" : ""}`, value: value, onChange: (e) => onChange(e.target.value) }), error && (_jsx("p", { className: "text-xs text-red-600 mt-1", children: error }))] }));
const Select = ({ label, required, value, options, error, onChange, }) => (_jsxs("div", { children: [_jsxs("label", { className: "text-sm font-medium", children: [label, " ", required && _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { className: `input w-full ${error ? "border-red-500" : ""}`, value: value, onChange: (e) => onChange(e.target.value), children: [_jsx("option", { value: "", children: "Select" }), options?.map((o) => (_jsx("option", { value: o.id, children: o.name }, o.id)))] }), error && (_jsx("p", { className: "text-xs text-red-600 mt-1", children: error }))] }));
const Textarea = ({ label, value, onChange }) => (_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: label }), _jsx("textarea", { className: "input w-full h-24", value: value, onChange: (e) => onChange(e.target.value) })] }));
