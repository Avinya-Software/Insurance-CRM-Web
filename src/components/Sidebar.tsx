import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  RefreshCcw,
  Building2,
  AlertTriangle,
  Package,
  Settings,
  Target,
  Megaphone,
  LogOut,
  History,
  ListTodo,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

/* ================= JWT HELPER ================= */

const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    return {
      fullName: decoded.FullName,
      email: decoded.email || "",
      role: decoded.Role,
    };
  } catch {
    return null;
  }
};

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Sidebar component, displays a collapsible sidebar with navigation links and user information.
 * @returns {JSX.Element} A JSX element representing the Sidebar component.
 */

/*******  71c90cbc-b468-4491-9b2f-c8552fd1dac0  *******/
const Sidebar = () => {
  const user = getUserFromToken();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isAdmin = user?.role === "SuperAdmin";

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`bg-slate-900 text-white h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* ---------- LOGO & TOGGLE ---------- */}
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <p className="text-xl font-bold">Avinya</p>
            <p className="text-xs text-slate-400">INSURANCE CRM</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <NavLink
              to="/tasks"
              className="p-2 rounded-lg hover:bg-slate-800 transition"
              title="View Tasks"
            >
              <ListTodo size={18} />
            </NavLink>
          )}

          {/* COLLAPSE TOGGLE */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-800 transition"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>

      {/* ---------- NAV ---------- */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {/* ================= ADVISOR MENU ================= */}
        {!isAdmin && (
          <>
            <NavItem
              to="/"
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              isCollapsed={isCollapsed}
            />

            <NavItem
              to="/leads"
              icon={<Target size={18} />}
              label="Leads"
              isCollapsed={isCollapsed}
            />

            <NavItem
              to="/customers"
              icon={<Users size={18} />}
              label="Customers"
              isCollapsed={isCollapsed}
            />

            <NavItem
              to="/insurer"
              icon={<Building2 size={18} />}
              label="Insurers"
              isCollapsed={isCollapsed}
            />

            <NavItem
              to="/products"
              icon={<Package size={18} />}
              label="Products"
              isCollapsed={isCollapsed}
            />

            <NavItem
              to="/policies"
              icon={<FileText size={18} />}
              label="Policies"
              isCollapsed={isCollapsed}
            />

            <NavItem
              to="/claims"
              icon={<AlertTriangle size={18} />}
              label="Claims"
              isCollapsed={isCollapsed}
            />

            <NavItem
              to="/renewals"
              icon={<RefreshCcw size={18} />}
              label="Renewals"
              isCollapsed={isCollapsed}
            />

            <NavItem
              to="/campaign"
              icon={<Megaphone size={18} />}
              label="Campaign"
              isCollapsed={isCollapsed}
            />

            <NavItem
              to="/settings"
              icon={<Settings size={18} />}
              label="Settings"
              isCollapsed={isCollapsed}
            />
          </>
        )}

        {/* ================= ADMIN MENU ================= */}
        {isAdmin && (
          <>
            <NavItem
              to="/admin"
              icon={<History size={18} />}
              label="Dashboard"
              isCollapsed={isCollapsed}
            />
            <NavItem
              to="/admin/history"
              icon={<History size={18} />}
              label="History"
              isCollapsed={isCollapsed}
            />
          </>
        )}
      </nav>

      {/* ---------- LOGOUT ---------- */}
      <button
        onClick={handleLogout}
        className={`flex items-center gap-3 px-4 py-2 mx-4 mb-3 rounded-lg text-sm
                   text-slate-300 hover:bg-red-600 hover:text-white transition ${
                     isCollapsed ? "justify-center" : ""
                   }`}
        title="Logout"
      >
        <LogOut size={18} />
        {!isCollapsed && "Logout"}
      </button>

      {/* ---------- USER INFO ---------- */}
      <div className="px-6 py-4 border-t border-slate-800 text-sm">
        {!isCollapsed ? (
          <>
            <p className="font-medium">{user?.fullName || " "}</p>
            <p className="text-slate-400">{user?.role || "User"}</p>
          </>
        ) : (
          <div className="flex justify-center">
            <div
              className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold"
              title={user?.fullName || "User"}
            >
              {user?.fullName?.charAt(0) || "U"}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

/* ================= NAV ITEM ================= */

const NavItem = ({
  to,
  icon,
  label,
  isCollapsed,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}) => (
  <NavLink
    to={to}
    end
    title={isCollapsed ? label : ""}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
      ${isCollapsed ? "justify-center" : ""}
      ${
        isActive
          ? "bg-slate-800 text-white"
          : "text-slate-300 hover:bg-slate-800"
      }`
    }
  >
    {icon}
    {!isCollapsed && label}
  </NavLink>
);

export default Sidebar;