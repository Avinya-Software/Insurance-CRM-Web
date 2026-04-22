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
import Insurer from "./pages/Insurer";
import TasksPage from "./pages/TasksPage";
import { Toaster } from "react-hot-toast";

/* -------- ADMIN PAGES -------- */
import LifePolicies from "./pages/LifePolicies";
import Campaign from "./pages/Campaign";
import LeadFollowUpPage from "./pages/LeadFollowUpPage";
import UserTeamMaster from "./pages/UserTeamMaster";
import Company from "./pages/Company";
import RoleRedirect from "./RoleRedirect";
import Tasks from "./pages/Tasks";
import FamilyMembers from "./pages/FamilyMembers";
import PolicyType from "./pages/PolicyType";
import Segment from "./pages/Segment";
import BranchPage from "./pages/Branch";
import BankPage from "./pages/Bank";
import BrokerPage from "./pages/Broker";
import PaymentMethodPage from "./pages/PaymentMethod";

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
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/leads" element={<Lead />} />
          <Route path="/leads/:leadId/followups" element={<LeadFollowUpPage />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/lifepolicies" element={<LifePolicies />} />
          {/* <Route path="/insurer" element={<Insurer />} /> */}
          <Route path="/usertermmaster" element={<UserTeamMaster/>}/>
          <Route path="/renewals" element={<Renewals />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/campaign" element={<Campaign />} />
          {/* <Route path="/products" element={<Product />} /> */}
          {/* <Route path="/products" element={<Product />} /> */}
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/familymembers" element={<FamilyMembers />} />
          <Route path="/policy-type" element={<PolicyType />} />
          <Route path="/segment" element={<Segment />} />
          <Route path="/branch" element={<BranchPage />} />
          <Route path="/bank" element={<BankPage />} />
          <Route path="/broker" element={<BrokerPage />} />
          <Route path="/payment-method" element={<PaymentMethodPage />} />

          {/* ADMIN */}
          <Route path="/company" element={<Company />} />
          <Route
            path="/product"
            element={<Product />}
          />
        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
