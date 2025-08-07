import React from 'react';

type StatsCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  iconColor?: string;
};

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, iconColor = 'text-blue-500' }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center">
      <span className={`${iconColor} mr-2`}>{icon}</span>
      <div>
        <p className="text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;