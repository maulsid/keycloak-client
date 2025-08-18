import { Routes, Route } from 'react-router-dom';
import NotFound from '../pages/notFound/NotFound';
import ProtectedRoute from '../components/protected/Protected';;
import Login from '../pages/login/Login';
import AdminDashboard from '../pages/admin/AdminDashbaord';
import AccessCodes from '../pages/accessCode/AccessCode';
import CustomerDashboard from '../pages/customer/CustomerDashbaord';
import Callback from '../pages/callback/Callback';

const AppRoutes = () => {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={<Login />}
      />
      <Route path="/callback" element={<Callback />} />

      <Route path="*" element={<NotFound />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/access-codes"
        element={
          <ProtectedRoute>
            <AccessCodes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default AppRoutes;