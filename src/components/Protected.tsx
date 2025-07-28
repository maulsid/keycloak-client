import { useAuth } from "../context/AuthProvider";

const Protected = () => {
  const { token, logout } = useAuth();

  return (
    <div>
      <h1>Protected Page</h1>
      <p>Token: {token?.substring(0, 20)}...</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Protected;