import type { AccessCodeEmptyStateProps } from "../../../types";

const AccessCodeEmptyState: React.FC<AccessCodeEmptyStateProps> = ({ message }) => (
  <div className="text-center py-12">
    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-12 0 6 6 0 0112 0z" />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No access codes found</h3>
    <p className="mt-1 text-sm text-gray-500">{message}</p>
  </div>
);

export default AccessCodeEmptyState;