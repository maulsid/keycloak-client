import React from 'react';
import StatsGrid from '../../components/home/StatsGrid';
import LowInventoryTable from '../../components/home/LowInventoryTable';
import QuickActions from '../../components/home/QuickActions';
import CustomersTable from '../../components/home/CustomersTable';

const Home: React.FC = () => {
  return (
    <div className="bg-gray-100 p-6">
      <StatsGrid />
      <div className="grid grid-cols-2 gap-6">
        <LowInventoryTable />
        <QuickActions />
      </div>
      <CustomersTable />
    </div>
  );
};

export default Home;
