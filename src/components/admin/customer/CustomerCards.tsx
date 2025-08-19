
// import type { Customer } from "../../../types";

// interface CustomerCardsProps {
//   customers: Customer[];
// }

// export function CustomerCards({ customers }: CustomerCardsProps) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex items-center">
//           <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
//           </svg>
//           <div className="ml-4">
//             <p className="text-sm font-medium text-gray-500">Total Customers</p>
//             <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex items-center">
//           <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//           </svg>
//           <div className="ml-4">
//             <p className="text-sm font-medium text-gray-500">Active</p>
//             <p className="text-2xl font-bold text-gray-900">{customers.filter((c) => c.status === 'active').length}</p>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex items-center">
//           <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l1.5 1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//           </svg>
//           <div className="ml-4">
//             <p className="text-sm font-medium text-gray-500">Pending</p>
//             <p className="text-2xl font-bold text-gray-900">{customers.filter((c) => c.status === 'pending').length}</p>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex items-center">
//           <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
//           </svg>
//           <div className="ml-4">
//             <p className="text-sm font-medium text-gray-500">Total Codes</p>
//             <p className="text-2xl font-bold text-gray-900">{customers.reduce((sum, c) => sum + c.totalCodes, 0)}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { FaUsers, FaCheckCircle, FaClock, FaKey } from 'react-icons/fa';
import type { Customer } from '../../../types';

interface CustomerCardsProps {
  customers: Customer[];
}

export function CustomerCards({ customers }: CustomerCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <FaUsers className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <FaCheckCircle className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Active</p>
            <p className="text-2xl font-bold text-gray-900">{customers.filter((c) => c.status === 'active').length}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <FaClock className="h-8 w-8 text-yellow-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{customers.filter((c) => c.status === 'pending').length}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <FaKey className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Codes</p>
            <p className="text-2xl font-bold text-gray-900">{customers.reduce((sum, c) => sum + c.totalCodes, 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}