import type { CustomerStatCardProps } from "../../types";
import React from "react";

const CustomerStatCard: React.FC<CustomerStatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`${iconColor} h-8 w-8`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerStatCard;
