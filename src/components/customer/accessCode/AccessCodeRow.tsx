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
      <div className="text-sm text-gray-900">{code.orderId}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      {code.status !== "assigned" && (
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
