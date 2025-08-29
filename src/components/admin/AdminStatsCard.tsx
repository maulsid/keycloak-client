import type { AdminStatCardProps } from "../../types";

// Stat Card Component
const AdminStatCard: React.FC<AdminStatCardProps> = ({ title, value, icon:Icon }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <Icon />
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);
export default AdminStatCard;