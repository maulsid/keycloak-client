// import { useAuth } from "../context/AuthProvider";

// const Protected = () => {
//   const { token, logout } = useAuth();

//   return (
//     <div>
//       <h1>Protected Page</h1>
//       <p>Token: {token?.substring(0, 20)}...</p>
//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// };

// export default Protected;

import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const { isAuthenticated } = useAuth();
  const isAuthenticated=localStorage.getItem('token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;