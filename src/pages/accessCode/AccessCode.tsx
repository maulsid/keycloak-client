import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/redux-hooks';
import {
  fetchCodesThunk,
  setSearchTerm,
  setStatusFilter,
  setCurrentPage,
} from '../../redux/slices/codeSlice';
import AceesCodeFilterBar from '../../components/customer/accessCode/AccessCodeFilterBar';
import AccessCodeStatCard from '../../components/customer/accessCode/AccessCodeStatCard';
import AccessCodeEmptyState from '../../components/customer/accessCode/AccessCodeEmptyState';
import AccessCodeRow from '../../components/customer/accessCode/AccessCodeRow';
import type { AccessCode } from '../../types';
import Header from '../../components/common/Header';
import { Loading } from '../../components/common/Loading';
import { Error } from '../../components/common/Error';
import { useAuth } from '../../context/CognitoAuth';

const AccessCodes: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filteredCodes, searchTerm, statusFilter, currentPage, itemsPerPage, loading, error } = useAppSelector(
    (state) => state.codes
  );
    const { token } = useAuth();
  useEffect(() => {
    if (token) {
      dispatch(fetchCodesThunk(token));
    } else {
      dispatch({
        type: 'codes/fetchCodes/rejected',
        payload: 'No authentication token available',
      });
    }
  }, [dispatch, token]);

  // Map filteredCodes to match AccessCode type expected by components
  const mappedCodes: AccessCode[] = filteredCodes.map((code) => ({
    id: code.code_id.toString(),
    code: code.code,
    status: code.status || 'available',
    patientId: code.order_id ? code.order_id.toString() : undefined,
    patientName: code.order_id ? `Patient ${code.order_id}` : undefined, // Mock patient name
    utilizationDate: code.status === 'assigned' ? '2024-01-15' : undefined, // Mock data
    assignedDate: code.status === 'assigned' ? '2024-01-10' : undefined, // Mock data
  }));

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mappedCodes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mappedCodes.length / itemsPerPage);

  const paginate = (pageNumber: number) => dispatch(setCurrentPage(pageNumber));

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <Error message='An error occurred while fetching access codes. Please try again later.' />
    );
  }
  const statCards = [
    {
      title: 'Total Codes',
      value: mappedCodes.length,
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-12 0 6 6 0 0112 0z" />
        </svg>
      ),
      iconColor: 'text-blue-500',
    },
    {
      title: 'Utilized',
      value: mappedCodes.filter((code) => code.status === 'utilized').length,
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconColor: 'text-cyan-500',
    },
    {
      title: 'Available',
      value: mappedCodes.filter((code) => code.status === 'available').length,
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconColor: 'text-gray-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Access Code Inventory"
        showBackButton
        showActionButtons
      />      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AceesCodeFilterBar
          searchTerm={searchTerm}
          setSearchTerm={(value: string) => dispatch(setSearchTerm(value))}
          statusFilter={statusFilter}
          setStatusFilter={(value: string) => dispatch(setStatusFilter(value))}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {statCards.map((card, index) => (
            <AccessCodeStatCard key={index} {...card} />
          ))}
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Access Code Details</h2>
            <p className="text-gray-600 mt-2">
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, mappedCodes.length)} of {mappedCodes.length} Codes
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((code) => (
                  <AccessCodeRow key={code.id} code={code} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center px-6 py-4">
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
                  className={`px-3 py-1 rounded ${currentPage === page
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
        </div>
        {currentItems.length === 0 && <AccessCodeEmptyState message="Try adjusting your search or filter criteria." />}
      </div>
    </div>
  );
};

export default AccessCodes;