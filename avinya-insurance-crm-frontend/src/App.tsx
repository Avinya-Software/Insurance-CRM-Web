import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import AppLayout from "./layout/AppLayout";

/* -------- ADVISOR PAGES -------- */
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
import TasksPage from "./pages/TasksPage";
import { Toaster } from "react-hot-toast";

/* -------- ADMIN PAGES -------- */
import AdminAdvisorsByStatusPage from "./pages/AdminAdvisorsByStatusPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
     <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= PROTECTED + LAYOUT ================= */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* -------- ADVISOR ROUTES -------- */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Lead />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/insurer" element={<Insurer />} />
          <Route path="/renewals" element={<Renewals />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/products" element={<Product />} />
          <Route path="/tasks" element={<TasksPage />} />
          {/* -------- ADMIN ROUTES -------- */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/admin/history"
            element={<AdminAdvisorsByStatusPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
