import React from 'react';

const customers = [
  { name: 'Acme Corp', type: 'Enterprise', codes: 15, last: '2025-06-12' },
  { name: 'Beta Inc', type: 'SME', codes: 8, last: '2025-06-12' },
  { name: 'Delta Ltd', type: 'SME', codes: 120, last: '2025-05-??' },
  { name: 'Zeta PLC', type: 'Agency', codes: 250, last: '2025-05-20' },
];

const CustomersTable: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6">
      <h2 className="text-lg font-bold mb-2">Customers</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2">Customer</th>
            <th className="py-2">Customer Type</th>
            <th className="py-2">Available Codes</th>
            <th className="py-2">Last Codes</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, idx) => (
            <tr key={idx} className="border-b">
              <td className="py-2">{customer.name}</td>
              <td className="py-2">{customer.type}</td>
              <td className="py-2">{customer.codes}</td>
              <td className="py-2">{customer.last}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
