import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useUpsertProduct } from "../../hooks/product/useUpsertProduct";
import { useProductCategoryDropdown } from "../../hooks/product/useProductCategoryDropdown";
import { useInsurerDropdown } from "../../hooks/insurer/useInsurerDropdown";
/* ---------------- VALIDATION RULES ---------------- */
const regex = {
    productName: /^[A-Za-z0-9\s]{3,50}$/,
    productCode: /^[A-Z0-9_-]{2,20}$/,
    commissionRules: /^[A-Za-z0-9\s,.\-\/]{3,500}$/,
};
/* ---------------- COMPONENT ---------------- */
const ProductUpsertSheet = ({ open, onClose, product, insurerId, onSuccess, }) => {
    /* ---------------- API HOOKS ---------------- */
    const { mutateAsync, isLoading } = useUpsertProduct();
    const { data: categories } = useProductCategoryDropdown();
    const { data: insurers } = useInsurerDropdown();
    /* ---------------- FORM STATE ---------------- */
    const initialForm = {
        productId: null,
        insurerId: "",
        productCategoryId: 0,
        productName: "",
        productCode: "",
        defaultReminderDays: 0,
        commissionRules: "",
        isActive: true,
    };
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    /* ---------------- PREFILL ---------------- */
    useEffect(() => {
        if (!open)
            return;
        // EDIT MODE
        if (product && categories) {
            const matchedCategory = categories.find((c) => c.name === product.productCategory);
            setForm({
                productId: product.productId ?? null,
                insurerId: product.insurerId ?? "",
                productCategoryId: matchedCategory?.id ?? 0,
                productName: product.productName ?? "",
                productCode: product.productCode ?? "",
                defaultReminderDays: product.defaultReminderDays ?? 0,
                commissionRules: product.commissionRules ?? "",
                isActive: product.isActive ?? true,
            });
        }
        // ADD MODE (FROM INSURER)
        else {
            setForm({
                ...initialForm,
                insurerId: insurerId || "", // ✅ FORCE FROM INSURER TABLE
            });
        }
        setErrors({});
    }, [open, product, categories, insurerId]);
    /* ---------------- VALIDATION ---------------- */
    const validate = () => {
        const e = {};
        if (!form.insurerId)
            e.insurerId = "Insurer is required";
        if (!form.productCategoryId)
            e.productCategoryId = "Category is required";
        if (!form.productName)
            e.productName = "Product name is required";
        else if (!regex.productName.test(form.productName))
            e.productName = "3–50 letters/numbers only";
        if (!form.productCode)
            e.productCode = "Product code is required";
        else if (!regex.productCode.test(form.productCode))
            e.productCode =
                "Uppercase letters, numbers, _ or -";
        if (form.defaultReminderDays === null ||
            form.defaultReminderDays < 0)
            e.defaultReminderDays =
                "Must be 0 or greater";
        if (!form.commissionRules)
            e.commissionRules = "Commission rules required";
        else if (!regex.commissionRules.test(form.commissionRules))
            e.commissionRules =
                "Min 3 characters, no special symbols";
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
        await mutateAsync(form);
        toast.success("Product saved successfully");
        onClose();
        onSuccess();
    };
    if (!open)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/40 z-[60]", onClick: onClose }), _jsxs("div", { className: "fixed top-0 right-0 h-screen w-[420px] bg-white z-[70] shadow-2xl flex flex-col animate-slideInRight", children: [_jsxs("div", { className: "px-6 py-4 border-b flex justify-between items-center", children: [_jsx("h2", { className: "font-semibold text-lg", children: product ? "Edit Product" : "Add Product" }), _jsx("button", { onClick: onClose, children: _jsx(X, {}) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-6 py-4 space-y-4", children: [_jsx(Select, { label: "Insurer", value: form.insurerId, error: errors.insurerId, onChange: (v) => setForm({ ...form, insurerId: v }), options: insurers, valueKey: "insurerId", labelKey: "insurerName", disabled: !!insurerId }), _jsx(Select, { label: "Product Category", value: form.productCategoryId, error: errors.productCategoryId, onChange: (v) => setForm({
                                    ...form,
                                    productCategoryId: Number(v),
                                }), options: categories, valueKey: "id", labelKey: "name" }), _jsx(Input, { label: "Product Name", value: form.productName, error: errors.productName, onChange: (v) => setForm({ ...form, productName: v }) }), _jsx(Input, { label: "Product Code", value: form.productCode, error: errors.productCode, onChange: (v) => setForm({ ...form, productCode: v }) }), _jsx(Input, { label: "Default Reminder Days", type: "number", value: form.defaultReminderDays, error: errors.defaultReminderDays, onChange: (v) => setForm({
                                    ...form,
                                    defaultReminderDays: Number(v),
                                }) }), _jsx(Textarea, { label: "Commission Rules", value: form.commissionRules, error: errors.commissionRules, onChange: (v) => setForm({
                                    ...form,
                                    commissionRules: v,
                                }) }), _jsxs("label", { className: "flex items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", checked: form.isActive, onChange: (e) => setForm({
                                            ...form,
                                            isActive: e.target.checked,
                                        }) }), "Active"] })] }), _jsxs("div", { className: "px-6 py-4 border-t flex gap-3", children: [_jsx("button", { className: "flex-1 border rounded-lg py-2", onClick: onClose, children: "Cancel" }), _jsx("button", { disabled: isLoading, className: "flex-1 bg-blue-600 text-white rounded-lg py-2", onClick: handleSave, children: isLoading ? "Saving..." : "Save" })] })] })] }));
};
export default ProductUpsertSheet;
/* ---------------- HELPERS ---------------- */
const Input = ({ label, value, onChange, type = "text", error, }) => (_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: label }), _jsx("input", { type: type, className: `input w-full ${error ? "border-red-500" : ""}`, value: value, onChange: (e) => onChange(e.target.value) }), error && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: error }))] }));
const Textarea = ({ label, value, onChange, error, }) => (_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: label }), _jsx("textarea", { className: `input w-full h-24 resize-none ${error ? "border-red-500" : ""}`, value: value, onChange: (e) => onChange(e.target.value) }), error && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: error }))] }));
const Select = ({ label, value, onChange, options, valueKey, labelKey, error, disabled = false, }) => (_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: label }), _jsxs("select", { disabled: disabled, className: `input w-full ${error ? "border-red-500" : ""} disabled:bg-gray-100`, value: value, onChange: (e) => onChange(e.target.value), children: [_jsx("option", { value: "", children: "Select" }), options?.map((o) => (_jsx("option", { value: o[valueKey], children: o[labelKey] }, o[valueKey])))] }), error && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: error }))] }));
