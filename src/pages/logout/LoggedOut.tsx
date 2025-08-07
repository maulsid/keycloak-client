// // src/pages/LoggedOut.tsx
// export default function LoggedOut() {
//     return <h2>You have been successfully logged out.</h2>;
//   }
    
const LoggedOut = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Logged Out</h2>
        <p className="text-gray-600 mb-6 text-center">You have been successfully logged out.</p>
        <a
          href="/login"
          className="w-full block text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Return to Login
        </a>
      </div>
    </div>
  );
};

export default LoggedOut;