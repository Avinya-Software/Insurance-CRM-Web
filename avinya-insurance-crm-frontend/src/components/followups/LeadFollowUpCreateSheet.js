import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { X } from "lucide-react";
import FollowUpForm from "./FollowUpForm";
const LeadFollowUpCreateSheet = ({ open, leadId, leadName, onClose, onSuccess, }) => {
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);
    if (!open || !leadId)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/40 z-40", onClick: onClose }), _jsxs("div", { className: "\r\n          fixed top-0 right-0\r\n          h-full w-[420px]\r\n          bg-white\r\n          z-50\r\n          shadow-2xl\r\n          animate-slideInRight\r\n          flex flex-col\r\n        ", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold", children: "Create Follow Up" }), leadName && (_jsx("p", { className: "text-sm text-gray-600", children: leadName }))] }), _jsx("button", { onClick: onClose, children: _jsx(X, {}) })] }), _jsx("div", { className: "flex-1 overflow-y-auto px-6 py-4", children: _jsx(FollowUpForm, { leadId: leadId, onSuccess: onSuccess }) })] })] }));
};
export default LeadFollowUpCreateSheet;
