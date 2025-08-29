const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">404: Page Not Found</h2>
        <a href="/" className="text-blue-500 hover:underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
