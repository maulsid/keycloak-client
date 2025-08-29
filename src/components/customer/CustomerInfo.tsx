import type { CustomerInfoProps } from "../../types";

// Customer Information Component
const CustomerInfo: React.FC<CustomerInfoProps> = ({ customerData }) => (
  <div className="bg-white rounded-lg shadow mb-8">
    <div className="px-6 py-4 border-b border-gray-200">
      <h2 className="text-lg font-medium text-gray-900">
        Customer Information
      </h2>
    </div>
    <div className="px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Organization Name</p>
          <p className="text-base text-gray-900">{customerData.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Primary Contact</p>
          <p className="text-base text-gray-900">
            {customerData.primaryContact}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-base text-gray-900">{customerData.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Phone</p>
          <p className="text-base text-gray-900">{customerData.phone}</p>
        </div>
      </div>
    </div>
  </div>
);

export default CustomerInfo;
