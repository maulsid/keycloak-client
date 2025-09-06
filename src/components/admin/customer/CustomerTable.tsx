import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaKey } from "react-icons/fa";
import type { Customer } from "../../../types";
import { truncateUserId } from "../../../utils/helper/helper";

interface CustomerTableProps {
  customers: Customer[];
  getStatusBadge: (status: string) => React.ReactNode;
  getInvitationStatusBadge: (status: string) => React.ReactNode;
  onView?: (customerId: number) => void;
  onEdit?: (customerId: number) => void;
}

export function CustomerTable({
  customers,
  getStatusBadge,
  getInvitationStatusBadge,
  onView,
  onEdit,
}: CustomerTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Customer Accounts</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Access Codes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.customer_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {customer.name}
                    </div>
                    <div className="text-sm text-gray-900">
                      {customer.customer_id}
                    </div>
                    <div className="text-xs text-gray-400">
                      {customer.organization_address || "No address available"}
                    </div>
                  </div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {customer.customer_id}
                  </div>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">{customer.customer_contacts && customer.customer_contacts[0]?.phone_number !== undefined ? `phone:${customer.customer_contacts[0]?.phone_number}` : ''}</div>
                    <div className="flex items-center text-sm text-gray-500 relative group">
                      <span className="truncate cursor-pointer ">{truncateUserId(customer.customer_contacts && customer.customer_contacts[0]?.user_id)}</span>
                      {customer.customer_contacts && customer.customer_contacts[0]?.user_id && (
                        <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-0 z-10">
                          {customer.customer_contacts && customer.customer_contacts[0]?.user_id}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      {customer.customer_contacts && customer.customer_contacts[0]?.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    {getStatusBadge(customer.customer_status)}
                    {getInvitationStatusBadge(customer.customer_status|| "Registered")}
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-900">
                    {customer.customer_type}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="mr-1">🔑</span>{" "}
                      {customer.codes_available} available
                    </div>
                    <div className="text-xs text-gray-500">
                      {customer.codes_utilized} utilized / {customer.total_codes_ordered}{" "}
                      total
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="mr-1">📅</span> {customer.created_at
                        ? new Date(customer.created_at).toLocaleDateString()
                        : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">Registered: {customer.created_at
                      ? new Date(customer.created_at).toLocaleDateString()
                      : "N/A"}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView?.(customer.customer_id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View"
                    >
                      <FaEye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEdit?.(customer.customer_id)}
                      className="text-green-600 hover:text-green-900"
                      title="Edit"
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <Link
                      to={`/admin/provision-codes?customer=${customer.customer_id}`}
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