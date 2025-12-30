// src/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search policies, customers, or claims..."
            className="w-96 px-4 py-2 border rounded-lg text-sm outline-none"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            + New Policy
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
