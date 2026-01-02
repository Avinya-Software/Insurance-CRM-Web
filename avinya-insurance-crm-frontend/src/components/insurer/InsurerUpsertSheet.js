import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import toast from "react-hot-toast";
import { upsertInsurerApi, getInsurerPortalPasswordApi, } from "../../api/insurer.api";
/* ---------------- REGEX ---------------- */
const regex = {
    insurerName: /^[A-Za-z ]{3,50}$/,
    shortCode: /^[A-Z0-9]{2,10}$/,
    contactDetails: /^.{5,200}$/,
    portalUrl: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/,
    portalUsername: /^[A-Za-z0-9._@-]{3,50}$/,
    portalPassword: /^.{6,50}$/,
};
/* ---------------- COMPONENT ---------------- */
const InsurerUpsertSheet = ({ open, onClose, insurer, onSuccess, }) => {
    const isEdit = !!insurer;
    const initialForm = {
        insurerId: null,
        insurerName: "",
        shortCode: "",
        contactDetails: "",
        portalUrl: "",
        portalUsername: "",
        portalPassword: "",
    };
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [passwordFetched, setPasswordFetched] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    /* ---------------- PREFILL ---------------- */
    useEffect(() => {
        if (!open)
            return;
        if (isEdit) {
            setForm({
                ...insurer,
                portalPassword: "",
            });
        }
        else {
            setForm(initialForm);
        }
        setErrors({});
        setShowPassword(false);
        setPasswordFetched(false);
        setLoadingPassword(false);
    }, [open, insurer]);
    /* ---------------- VALIDATION ---------------- */
    const validate = () => {
        const e = {};
        if (!form.insurerName)
            e.insurerName = "Insurer name is required";
        else if (!regex.insurerName.test(form.insurerName))
            e.insurerName = "Only letters (3–50 characters)";
        if (!form.shortCode)
            e.shortCode = "Short code is required";
        else if (!regex.shortCode.test(form.shortCode))
            e.shortCode =
                "Uppercase letters & numbers (2–10)";
        if (!form.contactDetails)
            e.contactDetails = "Contact details are required";
        else if (!regex.contactDetails.test(form.contactDetails))
            e.contactDetails =
                "Min 5 chars, no special symbols";
        if (!form.portalUrl)
            e.portalUrl = "Portal URL is required";
        else if (!regex.portalUrl.test(form.portalUrl))
            e.portalUrl = "Invalid URL format";
        if (!form.portalUsername)
            e.portalUsername = "Username is required";
        else if (!regex.portalUsername.test(form.portalUsername))
            e.portalUsername = "Invalid username";
        if (!form.portalPassword)
            e.portalPassword = "Password is required";
        else if (!regex.portalPassword.test(form.portalPassword))
            e.portalPassword = "Minimum 6 characters";
        setErrors(e);
        if (Object.keys(e).length > 0) {
            toast.error("Please fix validation errors", {
                duration: 3000,
            });
            return false;
        }
        return true;
    };
    /* ---------------- PASSWORD ---------------- */
    const handleTogglePassword = async () => {
        if (!isEdit)
            return;
        if (!passwordFetched) {
            setLoadingPassword(true);
            try {
                const res = await getInsurerPortalPasswordApi(insurer.insurerId);
                setForm((f) => ({
                    ...f,
                    portalPassword: res.password,
                }));
                setPasswordFetched(true);
            }
            finally {
                setLoadingPassword(false);
            }
        }
        setShowPassword((p) => !p);
    };
    /* ---------------- SAVE ---------------- */
    const handleSave = async () => {
        if (!validate())
            return;
        setSaving(true);
        try {
            await upsertInsurerApi(form);
            toast.success("Insurer saved successfully");
            onClose();
            onSuccess();
        }
        catch {
            toast.error("Something went wrong");
        }
        finally {
            setSaving(false);
        }
    };
    if (!open)
        return null;
    /* ================= UI ================= */
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/40 z-[60]", onClick: onClose }), _jsxs("div", { className: "fixed top-0 right-0 h-screen w-[420px] bg-white z-[70] shadow-xl flex flex-col animate-slideInRight", children: [_jsxs("div", { className: "px-6 py-4 border-b flex justify-between", children: [_jsx("h2", { className: "font-semibold", children: isEdit ? "Edit Insurer" : "Add Insurer" }), _jsx("button", { onClick: onClose, children: _jsx(X, {}) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-6 py-4 space-y-4", children: [_jsx(Input, { label: "Insurer Name", value: form.insurerName, error: errors.insurerName, onChange: (v) => setForm({ ...form, insurerName: v }) }), _jsx(Input, { label: "Short Code", value: form.shortCode, error: errors.shortCode, onChange: (v) => setForm({ ...form, shortCode: v }) }), _jsx(TextArea, { label: "Contact Details", value: form.contactDetails, error: errors.contactDetails, onChange: (v) => setForm({
                                    ...form,
                                    contactDetails: v,
                                }) }), _jsx(Input, { label: "Portal URL", value: form.portalUrl, error: errors.portalUrl, onChange: (v) => setForm({ ...form, portalUrl: v }) }), _jsx(Input, { label: "Portal Username", value: form.portalUsername, error: errors.portalUsername, onChange: (v) => setForm({
                                    ...form,
                                    portalUsername: v,
                                }) }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Portal Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? "text" : "password", className: `input w-full pr-10 ${errors.portalPassword
                                                    ? "border-red-500"
                                                    : ""}`, value: form.portalPassword, onChange: (e) => setForm({
                                                    ...form,
                                                    portalPassword: e.target.value,
                                                }) }), isEdit && (_jsx("button", { type: "button", className: "absolute right-2 top-2 text-slate-500", onClick: handleTogglePassword, children: loadingPassword
                                                    ? "..."
                                                    : showPassword
                                                        ? _jsx(EyeOff, {})
                                                        : _jsx(Eye, {}) }))] }), errors.portalPassword && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.portalPassword }))] })] }), _jsxs("div", { className: "px-6 py-4 border-t flex gap-3", children: [_jsx("button", { className: "flex-1 border rounded-lg py-2", onClick: onClose, children: "Cancel" }), _jsx("button", { disabled: saving, className: "flex-1 bg-blue-600 text-white rounded-lg py-2", onClick: handleSave, children: saving ? "Saving..." : "Save" })] })] })] }));
};
export default InsurerUpsertSheet;
/* ---------------- INPUT ---------------- */
const Input = ({ label, value, onChange, error, }) => (_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: label }), _jsx("input", { className: `input w-full ${error ? "border-red-500" : ""}`, value: value, onChange: (e) => onChange(e.target.value) }), error && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: error }))] }));
/* ---------------- TEXTAREA ---------------- */
const TextArea = ({ label, value, onChange, error, }) => (_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: label }), _jsx("textarea", { rows: 3, className: `input w-full resize-none ${error ? "border-red-500" : ""}`, value: value, onChange: (e) => onChange(e.target.value) }), error && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: error }))] }));
