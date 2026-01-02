import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useUpsertPolicy } from "../../hooks/policy/useUpsertPolicy";
import { usePolicyTypesDropdown } from "../../hooks/policy/usePolicyTypesDropdown";
import { usePolicyStatusesDropdown } from "../../hooks/policy/usePolicyStatusesDropdown";
import { useCustomerDropdown } from "../../hooks/customer/useCustomerDropdown";
import { useInsurerDropdown } from "../../hooks/insurer/useInsurerDropdown";
import { useProductDropdown } from "../../hooks/product/useProductDropdown";
const PolicyUpsertSheet = ({ open, onClose, policy, customerId, onSuccess, }) => {
    /* ---------------- FORM STATE ---------------- */
    const initialForm = {
        policyId: null,
        customerId: "",
        insurerId: "",
        productId: "",
        policyTypeId: 0,
        policyStatusId: 0,
        registrationNo: "",
        startDate: "",
        endDate: "",
        premiumNet: 0,
        premiumGross: 0,
        paymentMode: "",
        paymentDueDate: "",
        renewalDate: "",
        brokerCode: "",
        policyCode: "",
    };
    const [form, setForm] = useState(initialForm);
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});
    /* ---------------- API HOOKS ---------------- */
    const { mutateAsync, isLoading } = useUpsertPolicy();
    const { data: customers } = useCustomerDropdown();
    const { data: insurers } = useInsurerDropdown();
    const { data: products } = useProductDropdown(form.insurerId || undefined);
    const { data: policyTypes } = usePolicyTypesDropdown();
    const { data: policyStatuses } = usePolicyStatusesDropdown();
    /* ---------------- PREFILL ---------------- */
    useEffect(() => {
        if (!open)
            return;
        if (policy) {
            // EDIT MODE
            setForm({
                ...initialForm,
                ...policy,
                policyId: policy.policyId ?? null,
                customerId: policy.customerId,
                startDate: policy.startDate?.split("T")[0] ?? "",
                endDate: policy.endDate?.split("T")[0] ?? "",
                paymentDueDate: policy.paymentDueDate?.split("T")[0] ?? "",
                renewalDate: policy.renewalDate?.split("T")[0] ?? "",
            });
        }
        else {
            // ADD MODE
            setForm({
                ...initialForm,
                customerId: customerId || "", // ✅ FORCE CUSTOMER
            });
            setFiles([]);
        }
        setErrors({});
    }, [open, policy, customerId]);
    /* ---------------- RESET PRODUCT ON INSURER CHANGE ---------------- */
    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            productId: "",
        }));
    }, [form.insurerId]);
    /* ---------------- VALIDATION ---------------- */
    const validate = () => {
        const e = {};
        if (!form.customerId)
            e.customerId = "Customer is required";
        if (!form.insurerId)
            e.insurerId = "Insurer is required";
        if (!form.productId)
            e.productId = "Product is required";
        if (!form.policyTypeId)
            e.policyTypeId = "Policy type is required";
        if (!form.policyStatusId)
            e.policyStatusId = "Policy status is required";
        if (!form.registrationNo)
            e.registrationNo = "Registration number is required";
        if (!form.startDate)
            e.startDate = "Start date is required";
        if (!form.endDate)
            e.endDate = "End date is required";
        if (form.startDate &&
            form.endDate &&
            new Date(form.endDate) < new Date(form.startDate)) {
            e.endDate = "End date must be after start date";
        }
        if (form.premiumNet < 0)
            e.premiumNet = "Must be 0 or greater";
        if (form.premiumGross < 0)
            e.premiumGross = "Must be 0 or greater";
        if (!form.paymentMode)
            e.paymentMode = "Payment mode is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    /* ---------------- SAVE ---------------- */
    const handleSave = async () => {
        if (!validate())
            return;
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== null &&
                value !== undefined &&
                !(key === "policyId" && !value)) {
                formData.append(key, String(value));
            }
        });
        if (form.startDate)
            formData.set("startDate", new Date(form.startDate).toISOString());
        if (form.endDate)
            formData.set("endDate", new Date(form.endDate).toISOString());
        if (form.paymentDueDate)
            formData.set("paymentDueDate", new Date(form.paymentDueDate).toISOString());
        if (form.renewalDate)
            formData.set("renewalDate", new Date(form.renewalDate).toISOString());
        files.forEach((file) => formData.append("PolicyDocuments", file));
        await mutateAsync(formData);
        onClose();
        onSuccess();
    };
    if (!open)
        return null;
    /* ================= UI ================= */
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/40 z-[60]", onClick: onClose }), _jsxs("div", { className: "fixed top-0 right-0 w-[420px] h-screen bg-white z-[70] shadow-xl flex flex-col animate-slideInRight", children: [_jsxs("div", { className: "px-6 py-4 border-b flex justify-between", children: [_jsx("h2", { className: "font-semibold", children: policy ? "Edit Policy" : "Add Policy" }), _jsx("button", { onClick: onClose, children: _jsx(X, {}) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-6 py-4 space-y-4", children: [_jsx(Select, { label: "Customer", value: form.customerId, error: errors.customerId, options: customers, valueKey: "customerId", labelKey: "fullName", disabled: !!customerId, onChange: (v) => setForm({ ...form, customerId: v }) }), _jsx(Select, { label: "Insurer", value: form.insurerId, error: errors.insurerId, options: insurers, valueKey: "insurerId", labelKey: "insurerName", onChange: (v) => setForm({ ...form, insurerId: v, productId: "" }) }), _jsx(Select, { label: "Product", value: form.productId, error: errors.productId, options: products, disabled: !form.insurerId, valueKey: "productId", labelKey: "productName", onChange: (v) => setForm({ ...form, productId: v }) }), _jsx(Select, { label: "Policy Type", value: form.policyTypeId, error: errors.policyTypeId, options: policyTypes, onChange: (v) => setForm({ ...form, policyTypeId: Number(v) }) }), _jsx(Select, { label: "Policy Status", value: form.policyStatusId, error: errors.policyStatusId, options: policyStatuses, onChange: (v) => setForm({ ...form, policyStatusId: Number(v) }) }), _jsx(Input, { label: "Registration No", value: form.registrationNo, error: errors.registrationNo, onChange: (v) => setForm({ ...form, registrationNo: v }) }), _jsx(Input, { type: "date", label: "Start Date", value: form.startDate, error: errors.startDate, onChange: (v) => setForm({ ...form, startDate: v }) }), _jsx(Input, { type: "date", label: "End Date", value: form.endDate, error: errors.endDate, onChange: (v) => setForm({ ...form, endDate: v }) }), _jsx(Input, { type: "number", label: "Premium Net", value: form.premiumNet, error: errors.premiumNet, onChange: (v) => setForm({ ...form, premiumNet: Number(v) }) }), _jsx(Input, { type: "number", label: "Premium Gross", value: form.premiumGross, error: errors.premiumGross, onChange: (v) => setForm({ ...form, premiumGross: Number(v) }) }), _jsx(Input, { label: "Payment Mode", value: form.paymentMode, error: errors.paymentMode, onChange: (v) => setForm({ ...form, paymentMode: v }) }), _jsx(Input, { type: "date", label: "Payment Due Date", value: form.paymentDueDate, onChange: (v) => setForm({ ...form, paymentDueDate: v }) }), _jsx(Input, { type: "date", label: "Renewal Date", value: form.renewalDate, onChange: (v) => setForm({ ...form, renewalDate: v }) }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Policy Documents" }), _jsx("input", { type: "file", multiple: true, className: "input w-full", onChange: (e) => setFiles(Array.from(e.target.files || [])) })] }), _jsx(Input, { label: "Broker Code", value: form.brokerCode, onChange: (v) => setForm({ ...form, brokerCode: v }) }), _jsx(Input, { label: "Policy Code", value: form.policyCode, onChange: (v) => setForm({ ...form, policyCode: v }) })] }), _jsxs("div", { className: "px-6 py-4 border-t flex gap-3", children: [_jsx("button", { className: "flex-1 border rounded-lg py-2", onClick: onClose, children: "Cancel" }), _jsx("button", { disabled: isLoading, className: "flex-1 bg-blue-600 text-white rounded-lg py-2", onClick: handleSave, children: isLoading ? "Saving..." : "Save" })] })] })] }));
};
export default PolicyUpsertSheet;
/* ---------------- HELPERS ---------------- */
const Input = ({ label, value, onChange, type = "text", error, }) => (_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: label }), _jsx("input", { type: type, className: `input w-full ${error ? "border-red-500" : ""}`, value: value, onChange: (e) => onChange(e.target.value) }), error && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: error }))] }));
const Select = ({ label, options, value, onChange, disabled = false, valueKey = "id", labelKey = "name", error, }) => (_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: label }), _jsxs("select", { disabled: disabled, className: `input w-full ${error ? "border-red-500" : ""} disabled:bg-gray-100`, value: value, onChange: (e) => onChange(e.target.value), children: [_jsx("option", { value: "", children: "Select" }), options?.map((o) => (_jsx("option", { value: o[valueKey], children: o[labelKey] }, o[valueKey])))] }), error && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: error }))] }));
