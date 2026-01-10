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
} from "lucide-react";

/* ================= JWT HELPER ================= */

const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    return {
      fullName: decoded.FullName,
      email: decoded.email,
      role:
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
    };
  } catch {
    return null;
  }
};

const Sidebar = () => {
  const user = getUserFromToken();
  const navigate = useNavigate();

  const isAdmin = user?.role === "SuperAdmin";

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      {/* ---------- LOGO ---------- */}
      <div className="px-6 py-5 text-xl font-bold border-b border-slate-800">
        Avinya
        <p className="text-xs text-slate-400">INSURANCE CRM</p>
      </div>

      {/* ---------- NAV ---------- */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {/* ================= ADVISOR MENU ================= */}
        {!isAdmin && (
          <>
            <NavItem
              to="/"
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
            />

            <NavItem
              to="/leads"
              icon={<Target size={18} />}
              label="Leads"
            />

            <NavItem
              to="/customers"
              icon={<Users size={18} />}
              label="Customers"
            />

            <NavItem
              to="/insurer"
              icon={<Building2 size={18} />}
              label="Insurers"
            />

            <NavItem
              to="/policies"
              icon={<FileText size={18} />}
              label="Policies"
            />

            <NavItem
              to="/products"
              icon={<Package size={18} />}
              label="Products"
            />

            <NavItem
              to="/claims"
              icon={<AlertTriangle size={18} />}
              label="Claims"
            />

            <NavItem
              to="/renewals"
              icon={<RefreshCcw size={18} />}
              label="Renewals"
            />

            <NavItem
              to="/campaign"
              icon={<Megaphone size={18} />}
              label="Campaign"
            />

            <NavItem
              to="/settings"
              icon={<Settings size={18} />}
              label="Settings"
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
            />
            <NavItem
              to="/admin/history"
              icon={<History size={18} />}
              label="History"
            />
          </>
        )}
      </nav>

      {/* ---------- LOGOUT ---------- */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 mx-4 mb-3 rounded-lg text-sm
                   text-slate-300 hover:bg-red-600 hover:text-white transition"
      >
        <LogOut size={18} />
        Logout
      </button>

      {/* ---------- USER INFO ---------- */}
      <div className="px-6 py-4 border-t border-slate-800 text-sm">
        <p className="font-medium">
          {user?.fullName || " "}
        </p>
        <p className="text-slate-400">
          {user?.role || "User"}
        </p>
      </div>
    </aside>
  );
};

/* ================= NAV ITEM ================= */

const NavItem = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
      ${
        isActive
          ? "bg-slate-800 text-white"
          : "text-slate-300 hover:bg-slate-800"
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default Sidebar;
