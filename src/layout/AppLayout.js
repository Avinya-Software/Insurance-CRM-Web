import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
const AppLayout = () => {
    return (_jsxs("div", { className: "flex h-screen bg-slate-100", children: [_jsx(Sidebar, {}), _jsx("main", { className: "flex-1 overflow-y-auto", children: _jsx("div", { className: "p-6", children: _jsx(Outlet, {}) }) })] }));
};
export default AppLayout;
