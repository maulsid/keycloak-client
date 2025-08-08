import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import Public from '../components/public/Public';
import LoggedOut from '../pages/logout/LoggedOut';
import NotFound from '../pages/notFound/NotFound';
import ProtectedRoute from '../components/protected/Protected';
import Home from '../pages/home/Home';
import AppLayout from '../layout/AppLayout';
import DashboardPage from '../pages/dashboard/DashbaordPage';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes without layout */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Public />}
      />
      <Route path="/logged-out" element={<LoggedOut />} />
      <Route path="*" element={<NotFound />} />

      {/* Protected routes wrapped in AppLayout */}
      <Route element={<AppLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;