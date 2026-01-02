import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { createFollowUpApi } from "../../api/leadFollowUp.api";
const FollowUpForm = ({ leadId, onSuccess }) => {
    const [followUpDate, setFollowUpDate] = useState("");
    const [nextFollowUpDate, setNextFollowUpDate] = useState("");
    const [remark, setRemark] = useState("");
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    // refs to open date picker when clicking container
    const followUpRef = useRef(null);
    const nextFollowUpRef = useRef(null);
    /* ---------------- VALIDATION ---------------- */
    const validate = () => {
        const e = {};
        if (!followUpDate) {
            e.followUpDate = "Follow up date is required";
        }
        if (!nextFollowUpDate) {
            e.nextFollowUpDate = "Next follow up date is required";
        }
        if (!remark.trim()) {
            e.remark = "Remark is required";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async () => {
        if (!validate())
            return;
        try {
            setSaving(true);
            await createFollowUpApi({
                leadId,
                followUpDate,
                nextFollowUpDate,
                remark,
            });
            onSuccess();
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "text-sm font-medium", children: ["Follow Up Date ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("div", { onClick: () => followUpRef.current?.showPicker(), className: "cursor-pointer", children: _jsx("input", { ref: followUpRef, type: "datetime-local", className: `input w-full ${errors.followUpDate ? "border-red-500" : ""}`, value: followUpDate, onChange: (e) => setFollowUpDate(e.target.value) }) }), errors.followUpDate && (_jsx("p", { className: "text-xs text-red-600 mt-1", children: errors.followUpDate }))] }), _jsxs("div", { children: [_jsxs("label", { className: "text-sm font-medium", children: ["Next Follow Up Date ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("div", { onClick: () => nextFollowUpRef.current?.showPicker(), className: "cursor-pointer", children: _jsx("input", { ref: nextFollowUpRef, type: "datetime-local", className: `input w-full ${errors.nextFollowUpDate ? "border-red-500" : ""}`, value: nextFollowUpDate, onChange: (e) => setNextFollowUpDate(e.target.value) }) }), errors.nextFollowUpDate && (_jsx("p", { className: "text-xs text-red-600 mt-1", children: errors.nextFollowUpDate }))] }), _jsxs("div", { children: [_jsxs("label", { className: "text-sm font-medium", children: ["Remark ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("textarea", { className: `input w-full h-24 ${errors.remark ? "border-red-500" : ""}`, placeholder: "Enter remark", value: remark, onChange: (e) => setRemark(e.target.value) }), errors.remark && (_jsx("p", { className: "text-xs text-red-600 mt-1", children: errors.remark }))] }), _jsx("button", { onClick: handleSubmit, disabled: saving, className: "w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-60", children: saving ? "Saving..." : "Save Follow Up" })] }));
};
export default FollowUpForm;
