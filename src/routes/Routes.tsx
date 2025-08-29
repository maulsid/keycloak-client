import { Routes, Route, Outlet } from "react-router-dom";
import NotFound from "../pages/notFound/NotFound";
import ProtectedRoute from "../components/protected/Protected";
import Login from "../pages/login/Login";
import AccessCodes from "../pages/accessCode/AccessCode";
import Callback from "../pages/callback/Callback";
import AdminDashboard from "../pages/admin/AdminDashbaord";
import CustomerDashboard from "../pages/customer/CustomerDashbaord";
import AdminCustomers from "../pages/admin/adminCustomer/AdminCustomer";
import CreateCustomer from "../pages/admin/createCustomer/CreateCustomer";
import ProvisionCodes from "../pages/admin/provisionCodes/ProvisionCodes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/customer/access-codes" element={<AccessCodes />} />

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
      </Route>
    </Routes>
  );
};

export default AppRoutes;
