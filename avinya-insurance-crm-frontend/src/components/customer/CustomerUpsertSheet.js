import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { createCustomerApi } from "../../api/customer.api";
const CustomerUpsertSheet = ({ open, onClose, customer, onSuccess, }) => {
    /* ---------------- LOCK BODY SCROLL ---------------- */
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);
    /* ---------------- FORM STATE ---------------- */
    const initialForm = {
        customerId: null,
        fullName: "",
        primaryMobile: "",
        secondaryMobile: "",
        email: "",
        address: "",
        dob: "",
        anniversary: "",
        notes: "",
        leadId: "",
    };
    const [form, setForm] = useState(initialForm);
    const [kycFiles, setKycFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    /* ---------------- PREFILL (EDIT MODE) ---------------- */
    useEffect(() => {
        if (!open)
            return;
        if (customer) {
            setForm({
                customerId: customer.customerId ?? null,
                fullName: customer.fullName ?? "",
                primaryMobile: customer.primaryMobile ?? "",
                secondaryMobile: customer.secondaryMobile ?? "",
                email: customer.email ?? "",
                address: customer.address ?? "",
                dob: customer.dob ? customer.dob.split("T")[0] : "",
                anniversary: customer.anniversary
                    ? customer.anniversary.split("T")[0]
                    : "",
                notes: customer.notes ?? "",
                leadId: customer.leadId ?? "",
            });
        }
        else {
            setForm(initialForm);
            setKycFiles([]);
        }
        setErrors({});
    }, [open, customer]);
    /* ---------------- VALIDATION ---------------- */
    const validate = () => {
        const e = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!form.fullName.trim())
            e.fullName = "Full name is required";
        if (!form.primaryMobile.trim())
            e.primaryMobile = "Mobile is required";
        else if (!mobileRegex.test(form.primaryMobile))
            e.primaryMobile = "Invalid mobile number";
        /* 🔥 EMAIL REQUIRED + REGEX */
        if (!form.email.trim())
            e.email = "Email is required";
        else if (!emailRegex.test(form.email))
            e.email = "Invalid email address";
        setErrors(e);
        if (Object.keys(e).length > 0) {
            toast.error("Please fix validation errors", {
                duration: 3000,
            });
            return false;
        }
        return true;
    };
    /* ---------------- SAVE ---------------- */
    const handleSave = async () => {
        if (!validate())
            return;
        setSaving(true);
        try {
            await createCustomerApi({
                ...form,
                kycFiles: kycFiles.length ? kycFiles : undefined,
            });
            onClose();
            onSuccess();
        }
        catch (error) {
            if (error.response?.status === 400) {
                const errorMessage = error.response?.data?.message ||
                    "Validation error";
                toast.error(errorMessage);
            }
            else {
                toast.error("Something went wrong. Please try again.");
            }
        }
        finally {
            setSaving(false);
        }
    };
    if (!open)
        return null;
    /* =================== UI =================== */
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/40 z-[60]", onClick: onClose }), _jsxs("div", { className: "fixed top-0 right-0 h-screen w-[420px] bg-white z-[70] shadow-2xl flex flex-col", children: [_jsxs("div", { className: "px-6 py-4 border-b flex justify-between", children: [_jsx("h2", { className: "font-semibold", children: customer ? "Edit Customer" : "Add Customer" }), _jsx("button", { onClick: onClose, children: _jsx(X, {}) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-6 py-4 space-y-4", children: [_jsx(Input, { label: "Full Name", required: true, value: form.fullName, error: errors.fullName, onChange: (v) => setForm({ ...form, fullName: v }) }), _jsx(Input, { label: "Primary Mobile", required: true, value: form.primaryMobile, error: errors.primaryMobile, onChange: (v) => setForm({ ...form, primaryMobile: v }) }), _jsx(Input, { label: "Secondary Mobile", value: form.secondaryMobile, onChange: (v) => setForm({
                                    ...form,
                                    secondaryMobile: v,
                                }) }), _jsx(Input, { label: "Email", required: true, value: form.email, error: errors.email, onChange: (v) => setForm({ ...form, email: v }) }), _jsx(Input, { label: "Address", value: form.address, onChange: (v) => setForm({ ...form, address: v }) }), _jsx(Input, { label: "Date of Birth", type: "date", value: form.dob, onChange: (v) => setForm({ ...form, dob: v }) }), _jsx(Input, { label: "Anniversary", type: "date", value: form.anniversary, onChange: (v) => setForm({
                                    ...form,
                                    anniversary: v,
                                }) }), _jsx(Textarea, { label: "Notes", value: form.notes, onChange: (v) => setForm({ ...form, notes: v }) }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "KYC Documents" }), _jsx("input", { type: "file", multiple: true, accept: ".pdf,.jpg,.png", onChange: (e) => setKycFiles(e.target.files
                                            ? Array.from(e.target.files)
                                            : []), className: "block mt-1 text-sm" }), _jsxs("p", { className: "text-xs text-slate-500 mt-1", children: ["Uploading files will mark KYC as", " ", _jsx("b", { children: "Uploaded" })] })] })] }), _jsxs("div", { className: "px-6 py-4 border-t flex gap-3", children: [_jsx("button", { className: "flex-1 border rounded-lg py-2", onClick: onClose, children: "Cancel" }), _jsx("button", { disabled: saving, className: "flex-1 bg-blue-600 text-white rounded-lg py-2", onClick: handleSave, children: saving ? "Saving..." : "Save" })] })] })] }));
};
export default CustomerUpsertSheet;
/* ---------------- HELPERS ---------------- */
const Input = ({ label, required, value, error, type = "text", onChange, }) => (_jsxs("div", { children: [_jsxs("label", { className: "text-sm font-medium", children: [label, " ", required && (_jsx("span", { className: "text-red-500", children: "*" }))] }), _jsx("input", { type: type, className: `input w-full ${error ? "border-red-500" : ""}`, value: value, onChange: (e) => onChange(e.target.value) }), error && (_jsx("p", { className: "text-xs text-red-600 mt-1", children: error }))] }));
const Textarea = ({ label, value, onChange }) => (_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: label }), _jsx("textarea", { className: "input w-full h-24", value: value, onChange: (e) => onChange(e.target.value) })] }));
