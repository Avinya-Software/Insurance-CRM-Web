import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Policies from "./pages/Policies";
import Renewals from "./pages/Renewals";
import Claims from "./pages/Claims";
import Settings from "./pages/Settings";
import Lead from "./pages/Lead";
import Product from "./pages/Product";
import Campaign from "./pages/Campaign ";
import Insurer from "./pages/Insurer";
function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, { children: _jsx(AppLayout, {}) }), children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/leads", element: _jsx(Lead, {}) }), _jsx(Route, { path: "/customers", element: _jsx(Customers, {}) }), _jsx(Route, { path: "/policies", element: _jsx(Policies, {}) }), _jsx(Route, { path: "/insurer", element: _jsx(Insurer, {}) }), _jsx(Route, { path: "/renewals", element: _jsx(Renewals, {}) }), _jsx(Route, { path: "/claims", element: _jsx(Claims, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) }), _jsx(Route, { path: "/products", element: _jsx(Product, {}) })] })] }) }));
}
export default App;
