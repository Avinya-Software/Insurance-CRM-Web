import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  RefreshCcw,
  AlertTriangle,
  Settings,
  Target,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const Sidebar = () => {
const { fullName } = useSelector((state: RootState) => state.auth);

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 text-xl font-bold border-b border-slate-800">
        Avinya
        <p className="text-xs text-slate-400">INSURANCE CRM</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <NavItem to="/leads" icon={<Target size={18} />} label="Leads" />
        <NavItem to="/customers" icon={<Users size={18} />} label="Customers" />
        <NavItem to="/policies" icon={<FileText size={18} />} label="Policies" />
        <NavItem to="/renewals" icon={<RefreshCcw size={18} />} label="Renewals" />
        <NavItem to="/claims" icon={<AlertTriangle size={18} />} label="Claims" />
        <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
      </nav>

      {/* User */}
      <div className="px-6 py-4 border-t border-slate-800 text-sm">
        <p className="font-medium">
            {fullName || "Advisor"}
        </p>
        <p className="text-slate-400">Owner</p>
       </div>
    </aside>
  );
};

const NavItem = ({ to, icon, label }: any) => (
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
