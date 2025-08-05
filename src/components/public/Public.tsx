import { useAuth } from '../../context/AuthProvider';

const Public = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome</h1>
        <p className="text-gray-600 mb-6 text-center">Please login to access the dashboard</p>
        <button
          onClick={login}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Public;
