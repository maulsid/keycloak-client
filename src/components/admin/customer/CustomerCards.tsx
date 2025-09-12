import { FaCheckCircle, FaClock, FaKey, FaUsers } from "react-icons/fa";
import type { Customer } from "../../../types";

export function CustomerCards({ customers }: { customers: Customer[] }) {
  console.log("Rendering CustomerCards with customers:", customers);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <FaUsers className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-gray-900">
              {customers.length}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <FaCheckCircle className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Active</p>
            <p className="text-2xl font-bold text-gray-900">
              {customers.filter((c) => c.customer_status === "active").length}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <FaClock className="h-8 w-8 text-yellow-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-900">
              {customers.filter((c) => c.customer_status === "pending").length}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <FaKey className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Codes</p>
            <p className="text-2xl font-bold text-gray-900">
              {customers.reduce((sum, c) => sum + c.total_codes_ordered, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
