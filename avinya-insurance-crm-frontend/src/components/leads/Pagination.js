import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Pagination = ({ page, totalPages, onChange }) => {
    return (_jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [_jsx("button", { disabled: page === 1, onClick: () => onChange(page - 1), className: "btn", children: "Prev" }), _jsxs("span", { className: "px-3 py-1 text-sm", children: ["Page ", page, " of ", totalPages] }), _jsx("button", { disabled: page === totalPages, onClick: () => onChange(page + 1), className: "btn", children: "Next" })] }));
};
export default Pagination;
