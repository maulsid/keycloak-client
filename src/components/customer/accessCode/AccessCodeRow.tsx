import { Link } from "react-router-dom";
import AccessCodeStatusBadge from "./AccessCodeStatusBadge";
import type { AccessCodeRowProps } from "../../../types";

// Code Row Component
const AccessCodeRow: React.FC<AccessCodeRowProps> = ({ code }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900 font-mono">
        {code.code}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <AccessCodeStatusBadge status={code.status} />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{code.patientId || "-"}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{code.patientName || "-"}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center text-sm text-gray-900">
        {code.utilizationDate ? (
          <>
            <svg
              className="h-4 w-4 mr-1 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {code.utilizationDate}
          </>
        ) : (
          "-"
        )}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{code.assignedDate || "-"}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      {code.status === "assigned" && (
        <Link
          to={`/customer/assign-code?code=${code.code}`}
          className="text-cyan-500 hover:text-cyan-600 font-medium"
        >
          Assign
        </Link>
      )}
    </td>
  </tr>
);

export default AccessCodeRow;
