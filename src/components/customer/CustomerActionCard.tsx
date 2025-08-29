import { useNavigate } from "react-router-dom";
import type { CustomerActionCardProps } from "../../types";
import React from "react";

const CustomerActionCard: React.FC<CustomerActionCardProps> = ({ title, description, link, icon: Icon, iconColor }) => {
  const navigate = useNavigate();
  return (
    <span
      className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
      onClick={() => navigate(link)}
    >
      <div className="flex items-center justify-between">
        <div>
          <Icon className={`${iconColor} h-8 w-8`} />
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </span>
  );
};

export default CustomerActionCard;