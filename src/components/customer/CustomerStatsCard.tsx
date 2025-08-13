import type { CustomerStatCardProps } from "../../types";

// Stat Card Component
const CustomerStatCard: React.FC<CustomerStatCardProps> = ({ title, value, icon, iconColor }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className={iconColor}>{icon}</div>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default CustomerStatCard;