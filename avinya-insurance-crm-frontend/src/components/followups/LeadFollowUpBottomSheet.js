import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useLeadFollowUps } from "../../hooks/leadFollowUp/useLeadFollowUps";
const LeadFollowUpBottomSheet = ({ open, onClose, leadId, leadName, }) => {
    const sheetRef = useRef(null);
    const { data, isLoading, refetch, } = useLeadFollowUps(leadId || "");
    /* ---------- CLOSE ON OUTSIDE CLICK ---------- */
    useOutsideClick(sheetRef, () => {
        if (open)
            onClose();
    });
    /* ---------- LOCK BODY SCROLL ---------- */
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);
    /* ---------- 🔥 FORCE REFETCH WHEN OPENED ---------- */
    useEffect(() => {
        if (open && leadId) {
            refetch();
        }
    }, [open, leadId, refetch]);
    if (!open || !leadId)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/40 z-40", onClick: onClose }), _jsxs("div", { ref: sheetRef, className: "\r\n          fixed bottom-0 left-0 right-0\r\n          bg-white\r\n          rounded-t-2xl\r\n          shadow-2xl\r\n          z-50\r\n          h-[55vh]\r\n          flex flex-col\r\n          animate-slideUp\r\n        ", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold", children: "Lead Follow Ups" }), leadName && (_jsx("p", { className: "text-sm text-gray-600", children: leadName }))] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 rounded-full", children: _jsx(X, { size: 20 }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto px-6 py-4", children: isLoading ? (_jsx("div", { className: "flex justify-center py-8", children: _jsx("p", { className: "text-gray-500", children: "Loading follow ups..." }) })) : !data || data.length === 0 ? (_jsx("div", { className: "flex justify-center py-8", children: _jsx("p", { className: "text-gray-500", children: "No follow ups found" }) })) : (_jsx("div", { className: "space-y-4", children: data.map((followUp) => (_jsx("div", { className: "border rounded-lg p-4 hover:shadow-md", children: _jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 font-medium", children: "Follow Up Date" }), _jsx("p", { className: "mt-1", children: new Date(followUp.followUpDate).toLocaleString() })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600 font-medium", children: "Next Follow Up" }), _jsx("p", { className: "mt-1", children: followUp.nextFollowUpDate
                                                        ? new Date(followUp.nextFollowUpDate).toLocaleString()
                                                        : "-" })] }), followUp.remark && (_jsxs("div", { className: "col-span-2", children: [_jsx("p", { className: "text-gray-600 font-medium", children: "Remark" }), _jsx("p", { className: "mt-1", children: followUp.remark })] })), _jsx("div", { className: "col-span-2 pt-2 border-t", children: _jsxs("p", { className: "text-xs text-gray-500", children: ["Created:", " ", new Date(followUp.createdAt).toLocaleString()] }) })] }) }, followUp.followUpId))) })) })] })] }));
};
export default LeadFollowUpBottomSheet;
