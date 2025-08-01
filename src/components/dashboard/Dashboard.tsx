import { useState, useEffect } from 'react';



interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

const fallbackUsers: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    image: 'https://via.placeholder.com/40',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    image: 'https://via.placeholder.com/40',
  },
  {
    id: 3,
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    image: 'https://via.placeholder.com/40',
  },
];

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from DummyJSON Users API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://dummyjson.com/users?limit=10');
        if (!response.ok) throw new Error('Failed to fetch data from DummyJSON API');
        const data = await response.json();
        const formattedUsers = data.users.map((user: any) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image,
        }));
        setUsers(formattedUsers.length ? formattedUsers : fallbackUsers);
        setFilteredUsers(formattedUsers.length ? formattedUsers : fallbackUsers);
      } catch (err) {
        setError('Unable to fetch data. Using fallback data.');
        console.error(err);
        setUsers(fallbackUsers);
        setFilteredUsers(fallbackUsers);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, users]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (

      <main className="flex-grow p-6">
        {/* Search and Filters */}
        <div className="bg-white p-4 shadow-md mb-6 rounded-lg">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by Name or Email"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-3 top-3 text-gray-500">🔍</span>
            </div>
            <select className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <button className="text-blue-500 hover:underline">More Filters</button>
            <button
              className="text-gray-500 hover:underline"
              onClick={() => setSearchTerm('')}
            >
              Reset All
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white shadow-md p-4 rounded-lg">
          {loading ? (
            <p className="text-gray-600 text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Showing {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length}{' '}
                USERS
              </p>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-teal-500 text-white">
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.image}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          Active
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <button className="text-gray-500 hover:text-blue-500">📞</button>
                          <button className="text-gray-500 hover:text-blue-500">📋</button>
                          <button className="text-gray-500 hover:text-blue-500">👤</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination佩斯 */}
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
                >
                  Previous
                </button>
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>
  );
};

export default Dashboard;