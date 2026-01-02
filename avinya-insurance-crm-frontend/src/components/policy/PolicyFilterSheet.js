import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePolicyStatusesDropdown } from "../../hooks/policy/usePolicyStatusesDropdown";
import { usePolicyTypesDropdown } from "../../hooks/policy/usePolicyTypesDropdown";
import { useCustomerDropdown } from "../../hooks/customer/useCustomerDropdown";
import { useInsurerDropdown } from "../../hooks/insurer/useInsurerDropdown";
import { useProductCategoryDropdown } from "../../hooks/product/useProductCategoryDropdown";
const PolicyFilterSheet = ({ open, filters, onApply, onClear, onClose, }) => {
    const [local, setLocal] = useState(filters);
    const { data: statuses } = usePolicyStatusesDropdown();
    const { data: types } = usePolicyTypesDropdown();
    const { data: customers } = useCustomerDropdown();
    const { data: insurers } = useInsurerDropdown();
    const { data: products } = useProductCategoryDropdown();
    useEffect(() => {
        setLocal(filters);
    }, [filters]);
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex", children: [_jsx("div", { className: "flex-1 bg-black/30", onClick: onClose }), _jsxs("div", { className: "w-96 bg-white h-full shadow-xl flex flex-col", children: [_jsxs("div", { className: "px-6 py-4 border-b flex justify-between", children: [_jsx("h2", { className: "font-semibold text-lg", children: "Filter Policies" }), _jsx("button", { onClick: onClose, children: _jsx(X, {}) })] }), _jsxs("div", { className: "flex-1 px-6 py-4 space-y-4 overflow-y-auto", children: [_jsx(Select, { label: "Policy Status", value: local.policyStatusId, options: statuses, onChange: (v) => setLocal({ ...local, policyStatusId: v || null }) }), _jsx(Select, { label: "Policy Type", value: local.policyTypeId, options: types, onChange: (v) => setLocal({ ...local, policyTypeId: v || null }) }), _jsx(Select, { label: "Customer", value: local.customerId, options: customers, valueKey: "customerId", labelKey: "fullName", onChange: (v) => setLocal({ ...local, customerId: v || null }) }), _jsx(Select, { label: "Insurer", value: local.insurerId, options: insurers, valueKey: "insurerId", labelKey: "insurerName", onChange: (v) => setLocal({ ...local, insurerId: v || null }) }), _jsx(Select, { label: "Product", value: local.productId, options: products, onChange: (v) => setLocal({ ...local, productId: v || null }) })] }), _jsxs("div", { className: "px-6 py-4 border-t flex gap-3", children: [_jsx("button", { className: "flex-1 border rounded-lg py-2 hover:bg-gray-50", onClick: onClear, children: "Clear All" }), _jsx("button", { className: "flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700", onClick: () => {
                                    onApply(local);
                                    onClose();
                                }, children: "Apply Filters" })] })] })] }));
};
export default PolicyFilterSheet;
/* helpers */
const Select = ({ label, value, options, onChange, valueKey = "id", labelKey = "name", }) => (_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: label }), _jsxs("select", { className: "input w-full", value: value ?? "", onChange: (e) => onChange(e.target.value), children: [_jsx("option", { value: "", children: "All" }), options?.map((o) => (_jsx("option", { value: o[valueKey], children: o[labelKey] }, o[valueKey])))] })] }));
