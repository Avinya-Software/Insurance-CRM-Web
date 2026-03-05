import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
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
import LifePolicies from "./pages/LifePolicies";
import Agency from "./pages/Agency";
import AddOnDetails from "./pages/AddOnDetails";
import HPADetails from "./pages/HPADetails";
import Make from "./pages/Make";
import Model from "./pages/Model";
import MakeModelPage from "./pages/MakeModelPage";

function App() {
  return (
    <BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />

        {/* ================= PROTECTED ================= */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Lead />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/lifepolicies" element={<LifePolicies />} />
          <Route path="/insurer" element={<Insurer />} />
          <Route path="/agency" element={<Agency type={0} title="General Agency" />} />
          <Route path="/hpadetails" element={<HPADetails />} />
          <Route path="/lifeagency" element={<Agency type={1} title="Life Agency" />} />
          <Route path="/makedetails" element={<MakeModelPage type={1} title="Make Details" />} />
<Route path="/modeldetails" element={<MakeModelPage type={2} title="Model Details" />} />
          <Route path="/renewals" element={<Renewals />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/products" element={<Product />} />
          <Route path="/addondetails" element={<AddOnDetails />} />
          <Route path="/tasks" element={<TasksPage />} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/admin/history"
            element={<AdminAdvisorsByStatusPage />}
          />
        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
