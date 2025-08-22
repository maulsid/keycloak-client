import { Routes, Route, Outlet } from 'react-router-dom';
import NotFound from '../pages/notFound/NotFound';
import ProtectedRoute from '../components/protected/Protected';
import Login from '../pages/login/Login';
import AccessCodes from '../pages/accessCode/AccessCode';
import Callback from '../pages/callback/Callback';
import AdminDashboard from '../pages/admin/AdminDashbaord';
import CustomerDashboard from '../pages/customer/CustomerDashbaord';
import AdminCustomers from '../pages/admin/AdminCustomer/AdminCustomer';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      <Route path="/customer/access-codes" element={<AccessCodes />} />
      <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path='/admin/customers' element={<AdminCustomers />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;