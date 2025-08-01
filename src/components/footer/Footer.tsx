const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">Job Portal</h3>
            <p className="text-sm text-gray-400">
              Connecting talent with opportunities since 2025
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">
              About Us
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Contact
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Job Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;