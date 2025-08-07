import React from 'react';
import StatsCard from './StatsCard';

const StatsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <StatsCard icon="🔑" title="Available Codes" value="2,560" />
      <StatsCard icon="📋" title="Codes Used" value="1,200" />
      <StatsCard icon="🛒" title="Orders Today" value="5" />
      <StatsCard icon="⚠️" title="Low Inventory" value="3" iconColor="text-red-500" />
    </div>
  );
};

export default StatsGrid;