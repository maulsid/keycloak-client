import { Outlet, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/protected/Protected";
import AdminCustomers from "../pages/admin/AdminCustomer/AdminCustomer";
import AdminDashboard from "../pages/admin/AdminDashbaord";
import CreateCustomer from "../pages/admin/createCustomer/CreateCustomer";
import ProvisionCodes from "../pages/admin/provisionCodes/ProvisionCodes";
import Callback from "../pages/callback/Callback";
import AccessCodes from "../pages/customer/accessCode/AccessCode";
import AssignCodePage from "../pages/customer/assigncode/AssignCodePage";
import CustomerDashboard from "../pages/customer/CustomerDashbaord";
import Login from "../pages/login/Login";
import NotFound from "../pages/notFound/NotFound";
import InviteAcceptPage from "../pages/invite/InviteAcceptPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/invite/accept" element={<InviteAcceptPage />} />

      <Route
        element={
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        }
      >
        {/*admin dashboard routes*/}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/create-customer" element={<CreateCustomer />} />
        <Route path="/admin/provision-codes" element={<ProvisionCodes />} />
        {/*customer dashboard routes*/}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/access-codes" element={<AccessCodes />} />
        <Route path="/customer/assign-code" element={<AssignCodePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
