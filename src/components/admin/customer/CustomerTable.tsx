// import { Link } from 'react-router-dom';
// import type { Customer } from '../../../types';

// interface CustomerTableProps {
//   customers: Customer[];
//   getStatusBadge: (status: string) => React.ReactNode;
//   getInvitationStatusBadge: (status: string) => React.ReactNode;
// }

// export function CustomerTable({ customers, getStatusBadge, getInvitationStatusBadge }: CustomerTableProps) {
//   return (
//     <div className="bg-white rounded-lg shadow">
//       <div className="px-6 py-4 border-b border-gray-200">
//         <h2 className="text-lg font-medium text-gray-900">Customer Accounts</h2>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Codes</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {customers.map((customer) => (
//               <tr key={customer.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">{customer.name}</div>
//                     <div className="text-sm text-gray-500">{customer.id}</div>
//                     <div className="text-xs text-gray-400">
//                       {customer.address}, {customer.city}, {customer.state} {customer.zipCode}
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div>
//                     <div className="text-sm text-gray-900">{customer.primaryContact}</div>
//                     <div className="flex items-center text-sm text-gray-500">
//                       <span className="mr-1">✉️</span> {customer.email}
//                     </div>
//                     <div className="flex items-center text-sm text-gray-500">
//                       <span className="mr-1">📞</span> {customer.phone}
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="space-y-2">
//                     {getStatusBadge(customer.status)}
//                     {getInvitationStatusBadge(customer.invitationStatus)}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">
//                     <div className="flex items-center">
//                       <span className="mr-1">🔑</span> {customer.availableCodes} available
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {customer.utilizedCodes} utilized / {customer.totalCodes} total
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">
//                     <div className="flex items-center">
//                       <span className="mr-1">📅</span> {customer.lastLogin ? customer.lastLogin : 'Never'}
//                     </div>
//                     <div className="text-xs text-gray-500">Registered: {customer.registrationDate}</div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <div className="flex space-x-2">
//                     <button className="text-blue-600 hover:text-blue-900">View</button>
//                     <button className="text-green-600 hover:text-green-900">Edit</button>
//                     <Link to={`/admin/provision-codes?customer=${customer.id}`} className="text-purple-600 hover:text-purple-900">
//                       Codes
//                     </Link>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaKey } from 'react-icons/fa';
import type { Customer } from '../../../types';

interface CustomerTableProps {
  customers: Customer[];
  getStatusBadge: (status: string) => React.ReactNode;
  getInvitationStatusBadge: (status: string) => React.ReactNode;
  onView?: (customerId: string) => void; // Optional prop for View action
  onEdit?: (customerId: string) => void; // Optional prop for Edit action
}

export function CustomerTable({ customers, getStatusBadge, getInvitationStatusBadge, onView, onEdit }: CustomerTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Customer Accounts</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Codes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.id}</div>
                    <div className="text-xs text-gray-400">
                      {customer.address}, {customer.city}, {customer.state} {customer.zipCode}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">{customer.primaryContact}</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-1">✉️</span> {customer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-1">📞</span> {customer.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    {getStatusBadge(customer.status)}
                    {getInvitationStatusBadge(customer.invitationStatus)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="mr-1">🔑</span> {customer.availableCodes} available
                    </div>
                    <div className="text-xs text-gray-500">
                      {customer.utilizedCodes} utilized / {customer.totalCodes} total
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="mr-1">📅</span> {customer.lastLogin ? customer.lastLogin : 'Never'}
                    </div>
                    <div className="text-xs text-gray-500">Registered: {customer.registrationDate}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView?.(customer.id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View"
                    >
                      <FaEye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEdit?.(customer.id)}
                      className="text-green-600 hover:text-green-900"
                      title="Edit"
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <Link
                      to={`/admin/provision-codes?customer=${customer.id}`}
                      className="text-purple-600 hover:text-purple-900"
                      title="Codes"
                    >
                      <FaKey className="h-5 w-5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}