import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/protected/Protected';
import Public from '../components/public/Public';
import LoggedOut from '../pages/logout/LoggedOut';
import NotFound from '../pages/notFound/NotFound';
import DashboardPage from '../pages/dashboard/DashbaordPage';
import Home from '../pages/home/Home';
import AppLayout from '../layout/AppLaylout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={

              <DashboardPage />

            }
          />
          <Route path='/' element={<Home />} />

        </Route>
      </Route>
      <Route path="/login" element={<Public />} />
      <Route path="/logged-out" element={<LoggedOut />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;