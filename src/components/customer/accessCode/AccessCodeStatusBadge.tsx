import type { AccessCodeStatusBadgeProps } from "../../../types";

// Status Badge Component
const AccessCodeStatusBadge: React.FC<AccessCodeStatusBadgeProps> = ({
  status,
}) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === "assigned"
        ? "bg-green-100 text-green-800"
        : "bg-gray-100 text-gray-800"
    }`}
  >
    <svg
      className={`h-3 w-3 mr-1 ${status === "assigned" ? "text-green-500" : "text-gray-500"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d={
          status === "utilized"
            ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        }
      />
    </svg>
    {status === "utilized" ? "Utilized" : "Available"}
  </span>
);

export default AccessCodeStatusBadge;
