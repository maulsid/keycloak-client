import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const Header = () => {
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex space-x-6">
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
          Home
        </Link>
        <Link to="#" className="text-gray-700 hover:text-blue-600 font-medium">
          Profile
        </Link>
      </div>
      <div className="relative flex items-center space-x-4">
        <div
          className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer flex items-center justify-center"
          onClick={toggleProfileMenu}
        >
          <span className="text-gray-700">👤</span>
        </div>
        {isProfileOpen && (
          <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg p-2 w-40 z-10">
            <button
              onClick={() => {
                logout();
                setIsProfileOpen(false);
              }}
              className="w-full text-left text-red-500 hover:bg-gray-100 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;