
const CustomerFooter = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-6 mt-8">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
                <p>&copy; {new Date().getFullYear()} Otsuka OPH. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 sm:mt-0">
                    <a
                        href="https://otsuka-oph.com/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-indigo-600 transition-colors"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="https://otsuka-oph.com/terms-and-conditions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-indigo-600 transition-colors"
                    >
                        Terms & Conditions
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default CustomerFooter;
