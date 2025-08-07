import React from 'react';

const QuickActions: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-2">Quick Actions</h2>
      <button className="bg-blue-500 text-white py-2 px-4 rounded mb-2 text-left">
        + Create Order
      </button>
      <button className="ml-2 bg-blue-500 text-white py-2 px-4 rounded text-left">
        ↑ Upload Codes CSV
      </button>
    </div>
  );
};

export default QuickActions;