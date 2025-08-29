import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/CognitoAuth";

// ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, token } = useAuth();
  // Allow access only if isAuthenticated is true and a token exists
  return isAuthenticated && token ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
