import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/protected/Protected';
import Public from '../components/public/Public';
import LoggedOut from '../pages/logout/LoggedOut';
import NotFound from '../pages/notFound/NotFound';
import DashboardPage from '../pages/dashboard/DashbaordPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Public />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/logged-out" element={<LoggedOut />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;