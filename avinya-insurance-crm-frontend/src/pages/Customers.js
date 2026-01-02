import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useCustomers } from "../hooks/customer/useCustomers";
import CustomerTable from "../components/customer/CustomerTable";
import CustomerUpsertSheet from "../components/customer/CustomerUpsertSheet";
import PolicyUpsertSheet from "../components/policy/PolicyUpsertSheet";
const Customers = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [search, setSearch] = useState("");
    /* ---------------- CUSTOMER SHEET ---------------- */
    const [openCustomerSheet, setOpenCustomerSheet] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    /* ---------------- POLICY SHEET ---------------- */
    const [openPolicySheet, setOpenPolicySheet] = useState(false);
    /* ---------------- API ---------------- */
    const { data, isLoading, refetch } = useCustomers(pageNumber, pageSize, search);
    /* ---------------- HANDLERS ---------------- */
    const handleAddCustomer = () => {
        setSelectedCustomer(null);
        setOpenCustomerSheet(true);
    };
    const handleEditCustomer = (customer) => {
        setSelectedCustomer(customer);
        setOpenCustomerSheet(true);
    };
    const handleAddPolicy = (customer) => {
        setSelectedCustomer(customer); // 👈 ONLY customerId will be used
        setOpenPolicySheet(true);
    };
    const handleCustomerSuccess = (isEdit) => {
        setOpenCustomerSheet(false);
        refetch(); // 🔥 refresh customer list
        toast.success(isEdit ? "Customer Saved successfully!" : "Customer Saved successfully!");
    };
    const handlePolicySuccess = () => {
        setOpenPolicySheet(false);
        setSelectedCustomer(null);
        toast.success("Policy added successfully!");
    };
    /* ================= UI ================= */
    return (_jsxs(_Fragment, { children: [_jsx(Toaster, { position: "top-right", reverseOrder: false }), _jsxs("div", { className: "bg-white rounded-lg border", children: [_jsx("div", { className: "px-4 py-5 border-b bg-gray-100", children: _jsxs("div", { className: "grid grid-cols-2 gap-y-4 items-start", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-serif font-semibold text-slate-900", children: "Customers" }), _jsxs("p", { className: "mt-1 text-sm text-slate-600", children: [data?.totalRecords ?? 0, " total customers"] })] }), _jsx("div", { className: "text-right", children: _jsxs("button", { className: "inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium", onClick: handleAddCustomer, children: [_jsx("span", { className: "text-lg leading-none", children: "+" }), "Add Customer"] }) }), _jsx("div", { children: _jsxs("div", { className: "relative w-[360px]", children: [_jsx("input", { type: "text", placeholder: "Search customers by name, email, or phone...", value: search, onChange: (e) => {
                                                    setSearch(e.target.value);
                                                    setPageNumber(1);
                                                }, className: "w-full h-10 pl-10 pr-3 border rounded text-sm" }), _jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", children: "\uD83D\uDD0D" })] }) }), _jsx("div", {})] }) }), _jsx(CustomerTable, { data: data?.customers || [], onEdit: handleEditCustomer, onAddPolicy: handleAddPolicy }), _jsxs("div", { className: "flex items-center justify-end gap-4 px-4 py-3 border-t text-sm", children: [_jsx("button", { disabled: pageNumber === 1, onClick: () => setPageNumber((p) => p - 1), className: "disabled:text-slate-400", children: "Prev" }), _jsxs("span", { children: ["Page ", pageNumber] }), _jsx("button", { disabled: (data?.customers?.length ?? 0) < pageSize, onClick: () => setPageNumber((p) => p + 1), className: "disabled:text-slate-400", children: "Next" })] }), isLoading && (_jsx("div", { className: "px-4 py-2 text-sm text-slate-500", children: "Loading..." }))] }), _jsx(CustomerUpsertSheet, { open: openCustomerSheet, customer: selectedCustomer, onClose: () => setOpenCustomerSheet(false), onSuccess: handleCustomerSuccess }), _jsx(PolicyUpsertSheet, { open: openPolicySheet, customerId: selectedCustomer?.customerId, onClose: () => {
                    setOpenPolicySheet(false);
                    setSelectedCustomer(null);
                }, onSuccess: handlePolicySuccess })] }));
};
export default Customers;
