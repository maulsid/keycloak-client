import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/redux-hooks';
import {
  fetchCodesThunk,
  setSearchTerm,
  setStatusFilter,
  resetSearch,
  setCurrentPage,
} from '../../redux/slices/codeSlice';
interface Code {
  code_id: number;
  code: string;
  status: string | null;
  order_id: number | null;
}

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { filteredCodes, searchTerm, statusFilter, currentPage, itemsPerPage, loading, error } = useAppSelector(
    (state) => state.codes
  );

  useEffect(() => {
    dispatch(fetchCodesThunk());
  }, [dispatch]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCodes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCodes.length / itemsPerPage);

  const paginate = (pageNumber: number) => dispatch(setCurrentPage(pageNumber));

  return (
    <main className="flex-grow p-6">
      <div className="bg-white p-4 shadow-md mb-6 rounded-lg">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by Code"
              className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
            <span className="absolute right-3 top-3 text-gray-500">🔍</span>
          </div>
          <select
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
          >
            <option value="all">All Statuses</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>
          <button className="text-blue-500 hover:underline">More Filters</button>
          <button
            className="text-gray-500 hover:underline"
            onClick={() => dispatch(resetSearch())}
          >
            Reset All
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md p-4 rounded-lg">
        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredCodes.length)} of {filteredCodes.length} CODES
            </p>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-teal-500 text-white">
                  <th className="p-3">Code ID</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((code: Code) => (
                  <tr key={code.code_id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{code.code_id}</td>
                    <td className="p-3">{code.code}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          code.status === 'assigned'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {code.status || 'Unassigned'}
                      </span>
                    </td>
                    <td className="p-3">{code.order_id || 'N/A'}</td>
                    {/* <td className="p-3">
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-blue-500">📋</button>
                        <button className="text-gray-500 hover:text-blue-500">✏️</button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>

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