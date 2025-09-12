// FILE: src/pages/admin/settings/Settings.tsx
import { Link } from "react-router-dom";
import Header from "../../../components/common/Header";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Settings" showBackButton backLink="/admin/dashboard" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Administration</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage portal administration and access.
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-900">Invite another admin</h3>
                <p className="text-sm text-gray-500">
                  Send an administrative invite for an existing organization & customer.
                </p>
              </div>
              <Link
                to="/admin/settings/invite-admin"
                className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Invite Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
