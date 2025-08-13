import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, token } = useAuth();
  const hasStoredToken = !!localStorage.getItem('token');
  // Allow access if either isAuthenticated is true or a token exists
  return isAuthenticated || hasStoredToken ? <>{children}</> : <Navigate to="/login" replace />;
};
export default ProtectedRoute;