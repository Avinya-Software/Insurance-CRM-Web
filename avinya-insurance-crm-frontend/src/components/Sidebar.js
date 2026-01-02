import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, RefreshCcw, AlertTriangle, Settings, Target, } from "lucide-react";
/* ================= JWT HELPER ================= */
const getUserFromToken = () => {
    try {
        const token = localStorage.getItem("token");
        if (!token)
            return null;
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        return {
            fullName: decoded.FullName,
            email: decoded.email,
            role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        };
    }
    catch {
        return null;
    }
};
const Sidebar = () => {
    const user = getUserFromToken();
    return (_jsxs("aside", { className: "w-64 bg-slate-900 text-white h-screen flex flex-col", children: [_jsxs("div", { className: "px-6 py-5 text-xl font-bold border-b border-slate-800", children: ["Avinya", _jsx("p", { className: "text-xs text-slate-400", children: "INSURANCE CRM" })] }), _jsxs("nav", { className: "flex-1 px-4 py-6 space-y-1", children: [_jsx(NavItem, { to: "/", icon: _jsx(LayoutDashboard, { size: 18 }), label: "Dashboard" }), _jsx(NavItem, { to: "/leads", icon: _jsx(Target, { size: 18 }), label: "Leads" }), _jsx(NavItem, { to: "/customers", icon: _jsx(Users, { size: 18 }), label: "Customers" }), _jsx(NavItem, { to: "/insurer", icon: _jsx(Users, { size: 18 }), label: "Insurers" }), _jsx(NavItem, { to: "/policies", icon: _jsx(FileText, { size: 18 }), label: "Policies" }), _jsx(NavItem, { to: "/products", icon: _jsx(FileText, { size: 18 }), label: "Products" }), _jsx(NavItem, { to: "/renewals", icon: _jsx(RefreshCcw, { size: 18 }), label: "Renewals" }), _jsx(NavItem, { to: "/claims", icon: _jsx(AlertTriangle, { size: 18 }), label: "Claims" }), _jsx(NavItem, { to: "/settings", icon: _jsx(Settings, { size: 18 }), label: "Settings" })] }), _jsxs("div", { className: "px-6 py-4 border-t border-slate-800 text-sm", children: [_jsx("p", { className: "font-medium", children: user?.fullName || "Advisor" }), _jsx("p", { className: "text-slate-400", children: user?.role || "User" })] })] }));
};
/* ================= NAV ITEM ================= */
const NavItem = ({ to, icon, label }) => (_jsxs(NavLink, { to: to, end: true, className: ({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
      ${isActive
        ? "bg-slate-800 text-white"
        : "text-slate-300 hover:bg-slate-800"}`, children: [icon, label] }));
export default Sidebar;
