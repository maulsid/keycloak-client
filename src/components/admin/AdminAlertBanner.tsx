import type { AdminAlertBannerProps } from "../../types";

// Alert Banner Component
const AdimnAlertBanner: React.FC<AdminAlertBannerProps> = ({
  pendingInvitations,
}) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8">
    <div className="flex">
      <svg
        className="h-5 w-5 text-yellow-600 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <div>
        <p className="text-sm font-medium text-yellow-800">
          Pending Invitations: {pendingInvitations}
        </p>
        <p className="text-sm text-yellow-700">
          There are {pendingInvitations} customer invitations awaiting response.
        </p>
      </div>
    </div>
  </div>
);

export default AdimnAlertBanner;
