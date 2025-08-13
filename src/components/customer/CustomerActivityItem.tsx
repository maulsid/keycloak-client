import type { CustomerActivityItemProps } from "../../types";

// Activity Item Component
const CustomerActivityItem: React.FC<CustomerActivityItemProps> = ({ action, patientId, date }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <p className="text-sm font-medium text-gray-900">{action}</p>
        {patientId && <p className="text-xs text-gray-500">Patient ID: {patientId}</p>}
      </div>
    </div>
    <div className="flex items-center text-sm text-gray-500">
      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {date}
    </div>
  </div>
);

export default CustomerActivityItem;