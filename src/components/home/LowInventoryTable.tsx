import React from 'react';

const inventoryData = [
  { customer: 'Acme Corp', codes: 15, status: 'Below threshold', color: 'text-yellow-500' },
  { customer: 'Beta Inc', codes: 8, status: 'Below threshold', color: 'text-yellow-500' },
  { customer: 'Gamma LLC', codes: 120, status: 'Above threshold', color: 'text-green-500' },
  { customer: 'Delta Ltd', codes: 5, status: 'Below threshold', color: 'text-yellow-500' },
];

const LowInventoryTable: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-2">Low Inventory</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2">Customer</th>
            <th className="py-2">Available Codes</th>
            <th className="py-2">Threshold Status</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td className="py-2">{item.customer}</td>
              <td className="py-2">{item.codes}</td>
              <td className={`py-2 ${item.color}`}>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LowInventoryTable;