import { useAuth } from "../context/AuthProvider";

const Public = () => {
  const { login } = useAuth();

  return (
    <div>
      <h1>Public Page</h1>
      <p>You are not logged in.</p>
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Public;

